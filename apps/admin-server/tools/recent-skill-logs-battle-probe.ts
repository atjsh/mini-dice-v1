import { Logger } from '@nestjs/common';
import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
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

type ProbeEvent = Pick<
  APIGatewayProxyEvent,
  | 'path'
  | 'httpMethod'
  | 'headers'
  | 'queryStringParameters'
  | 'body'
  | 'isBase64Encoded'
>;

type ProbeLambdaHandler = (
  event: ProbeEvent,
  context: Partial<Context>,
) => Promise<APIGatewayProxyResult>;

function hasLambdaHandler(
  value: unknown,
): value is { lambdaHandler: ProbeLambdaHandler } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'lambdaHandler' in value &&
    typeof value.lambdaHandler === 'function'
  );
}

function parseResponseBody(body: string): unknown {
  let value: unknown = body;
  while (typeof value === 'string') {
    value = JSON.parse(value) as unknown;
  }
  return value;
}

function getRowCount(value: unknown): number {
  return Array.isArray(value) ? value.length : 0;
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
  const serverModule: unknown = await import(serverMainPath);
  if (!hasLambdaHandler(serverModule)) {
    throw new TypeError('Server module does not export a Lambda handler');
  }
  const { lambdaHandler } = serverModule;
  const event = (limit?: string): ProbeEvent => ({
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
    const response = await lambdaHandler(event(limit), {});
    return {
      status: response.statusCode,
      body: parseResponseBody(response.body),
      durationMs: performance.now() - started,
    };
  };

  const defaultResponse = await invoke();
  const defaultRows = getRowCount(defaultResponse.body);
  if (defaultResponse.status !== 200 || defaultRows !== 10) {
    throw new Error(
      `Default recent-log limit returned status=${defaultResponse.status} rows=${defaultRows}`,
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
          defaultRows,
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
      const rows = getRowCount(response.body);
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
