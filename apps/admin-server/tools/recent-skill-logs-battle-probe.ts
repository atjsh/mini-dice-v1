import { Logger } from '@nestjs/common';
import { appendFileSync, readFileSync, writeFileSync } from 'fs';
import { sign } from 'jsonwebtoken';
import { performance } from 'perf_hooks';
import { setTimeout as sleep } from 'timers/promises';

function env(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

function summarize(values: number[]) {
  const sorted = [...values].sort((left, right) => left - right);
  return {
    calls: values.length,
    p95Ms: values.length
      ? Number(sorted[Math.ceil(values.length * 0.95) - 1].toFixed(2))
      : null,
  };
}

async function main() {
  if (
    process.env.DB_URL !== 'host.docker.internal' ||
    process.env.DB_PORT !== '55432' ||
    process.env.DB_DATABASE !== 'mini_dice_battle'
  ) {
    throw new Error('Recent-log probe requires the local battle database');
  }

  const csvPath = env('BATTLE_PROBE_CSV');
  const summaryPath = env('BATTLE_PROBE_SUMMARY');
  const readyPath = env('BATTLE_PROBE_READY');
  const phasePath = env('BATTLE_PHASE_FILE');
  const token = sign({ userId: env('BATTLE_USER_ID') }, env('JWT_SECRET'), {
    expiresIn: '12h',
  });
  const samples: Record<10 | 100, number[]> = { 10: [], 100: [] };
  const failures: string[] = [];
  let stopping = false;
  for (const signal of ['SIGTERM', 'SIGINT'] as const) {
    process.on(signal, () => (stopping = true));
  }

  Logger.overrideLogger(false);
  const serverMainPath = '../../server/src/main';
  const { lambdaHandler } = await import(serverMainPath);
  const event = (limit?: string) => ({
    path: '/recent-skill-logs',
    httpMethod: 'GET',
    headers: {
      authorization: `Bearer ${token}`,
      timezone: 'Asia/Seoul',
      host: 'localhost',
    },
    queryStringParameters: limit === undefined ? null : { limit },
    body: null,
    isBase64Encoded: false,
  });
  const invoke = async (limit?: string) => {
    const started = performance.now();
    const response = await lambdaHandler(event(limit) as any, {} as any);
    let body =
      typeof response.body === 'string'
        ? response.body
        : Buffer.from(response.body).toString();
    while (typeof body === 'string') body = JSON.parse(body);
    return {
      status: response.statusCode,
      body,
      durationMs: performance.now() - started,
    };
  };

  const defaultResponse = await invoke();
  if (defaultResponse.status !== 200 || defaultResponse.body.length !== 10) {
    throw new Error(
      `Default recent-log limit returned status=${defaultResponse.status} rows=${defaultResponse.body.length}`,
    );
  }

  const invalidStatuses: Record<string, number> = {};
  for (const value of ['0', '101', 'invalid']) {
    const response = await invoke(value);
    invalidStatuses[value] = response.status;
    if (response.status !== 400) {
      throw new Error(`Invalid limit ${value} returned ${response.status}`);
    }
  }

  writeFileSync(csvPath, 'timestamp_utc,phase,limit,status,rows,duration_ms\n');
  writeFileSync(readyPath, 'ready\n');
  const writeSummary = () =>
    writeFileSync(
      summaryPath,
      `${JSON.stringify(
        {
          defaultRows: defaultResponse.body.length,
          invalidStatuses,
          failures,
          limits: { 10: summarize(samples[10]), 100: summarize(samples[100]) },
        },
        null,
        2,
      )}\n`,
    );

  let limit: 10 | 100 = 10;
  while (!stopping) {
    const timestamp = new Date().toISOString();
    const phase = readFileSync(phasePath, 'utf8').trim();
    try {
      const response = await invoke(String(limit));
      const rows = Array.isArray(response.body) ? response.body.length : 0;
      appendFileSync(
        csvPath,
        `${timestamp},${phase},${limit},${
          response.status
        },${rows},${response.durationMs.toFixed(3)}\n`,
      );
      if (response.status !== 200 || rows !== limit) {
        failures.push(
          `phase=${phase} limit=${limit} status=${response.status} rows=${rows}`,
        );
      } else {
        samples[limit].push(response.durationMs);
      }
    } catch (error) {
      failures.push(
        `phase=${phase} limit=${limit} error=${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
    writeSummary();
    limit = limit === 10 ? 100 : 10;
    await sleep(2000);
  }

  writeSummary();
  process.stdout.write(
    `${JSON.stringify({
      samples: samples[10].length + samples[100].length,
      failures,
    })}\n`,
  );
  process.exit(failures.length === 0 ? 0 : 1);
}

void main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : error}\n`);
  process.exitCode = 1;
});
