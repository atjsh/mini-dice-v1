import {
  decodeSkillLogPayload,
  encodeSkillLogPayload,
} from '@packages/skill-log-codec';
import { NestFactory } from '@nestjs/core';
import { getDataSourceToken } from '@nestjs/typeorm';
import { createHash } from 'crypto';
import { writeFileSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import { dirname } from 'path';
import { DataSource, MoreThan, Repository } from 'typeorm';
import { AppModule } from '../app.module';
import { DATASOURCE_NAMES } from '../common/datasource-names';
import { PgSkillLogEntity } from '../entities/postgresql/pg-skill-log.entity';
import {
  MigrationProgress,
  SkillLogCompressionService,
} from './issue-specific/skill-log-compression.service';

const BATCH_SIZE = 1000;

function output(value: unknown) {
  process.stdout.write(`${JSON.stringify(value)}\n`);
}

function decodedPayload(row: PgSkillLogEntity) {
  if ((row.payload === null) !== (row.payloadCodec === null)) {
    throw new Error(`Incomplete compressed payload: ${row.id}`);
  }

  return row.payload && row.payloadCodec
    ? decodeSkillLogPayload(row.payload, row.payloadCodec)
    : {
        userActivity: row.userActivity ?? null,
        skillServiceResult: row.skillServiceResult ?? null,
      };
}

function canonicalPayload(row: PgSkillLogEntity) {
  const payload = decodedPayload(row);
  return JSON.stringify([
    payload.userActivity ?? null,
    payload.skillServiceResult ?? null,
  ]);
}

async function snapshot(
  repository: Repository<PgSkillLogEntity>,
  outputPath: string,
) {
  const hash = createHash('sha256');
  let lastId: string | undefined;
  let rows = 0;

  while (true) {
    const batch = await repository.find({
      where: lastId ? { id: MoreThan(lastId) } : {},
      order: { id: 'ASC' },
      take: BATCH_SIZE,
    });
    if (batch.length === 0) break;

    for (const row of batch)
      hash.update(`${row.id}\0${canonicalPayload(row)}\n`);
    rows += batch.length;
    lastId = batch[batch.length - 1].id;
  }

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${hash.digest('hex')}\n`);
  return { mode: 'snapshot', rows, outputPath };
}

async function smoke(repository: Repository<PgSkillLogEntity>) {
  const [source] = await repository.find({
    order: { createdAt: 'DESC' },
    take: 1,
  });
  if (!source) throw new Error('Skill-log smoke test requires one row');

  const sourcePayload = decodedPayload(source);
  const encoded = encodeSkillLogPayload(sourcePayload);
  const created = await repository.save(
    repository.create({
      userId: source.userId,
      skillRoute: source.skillRoute,
      userActivity: null,
      skillServiceResult: null,
      payload: encoded.payload,
      payloadCodec: encoded.payloadCodec,
    }),
  );

  try {
    const loaded = await repository.findOneByOrFail({ id: created.id });
    if (canonicalPayload(loaded) !== canonicalPayload(created)) {
      throw new Error('Skill-log smoke payload changed');
    }
    return { mode: 'smoke', createdId: created.id };
  } finally {
    await repository.delete(created.id);
  }
}

async function main() {
  const args = process.argv.slice(2);
  if (args[0] === '--') args.shift();
  const [command, argument, ...extra] = args;
  if (
    extra.length > 0 ||
    !['check', 'run', 'snapshot', 'smoke'].includes(command) ||
    (['check', 'smoke'].includes(command) && argument) ||
    (['run', 'snapshot'].includes(command) && !argument)
  ) {
    throw new Error(
      'Usage: migration:skill-log -- check | run <database> | snapshot <file> | smoke',
    );
  }

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: false,
  });

  try {
    const repository = app
      .get<DataSource>(getDataSourceToken(DATASOURCE_NAMES.POSTGRESQL))
      .getRepository(PgSkillLogEntity);

    if (command === 'snapshot') {
      output(await snapshot(repository, argument));
      return;
    }
    if (command === 'smoke') {
      output(await smoke(repository));
      return;
    }

    const service = app.get(SkillLogCompressionService);
    if (command === 'check') {
      output({ type: 'result', result: await service.check() });
      return;
    }

    const phaseFile = process.env.SKILL_LOG_MIGRATION_PHASE_FILE;
    const reporter = (progress: MigrationProgress) => {
      if (phaseFile) writeFileSync(phaseFile, `${progress.phase}\n`);
      output({ type: 'progress', ...progress });
    };
    output({
      type: 'result',
      result: await service.migrate(argument, reporter),
    });
  } finally {
    await app.close();
  }
}

void main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : error}\n`);
  process.exitCode = 1;
});
