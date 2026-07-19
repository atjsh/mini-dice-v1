import { createHash } from 'crypto';
import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import {
  decodeSkillLogPayload,
  encodeSkillLogPayload,
} from '@packages/skill-log-codec';
import { setTimeout as sleep } from 'timers/promises';
import type { DataSource, QueryRunner, Repository } from 'typeorm';
import { DATASOURCE_NAMES } from '../../common/datasource-names';
import { PgSkillLogEntity } from '../../entities/postgresql/pg-skill-log.entity';

const COMPRESSION_BATCH_SIZE = 500;
const DIGEST_BATCH_SIZE = 1000;
const BATCH_DELAY_MS = 100;
const COMPRESSION_ROWS_PER_VACUUM = 50_000;
const PROGRESS_INTERVAL_MS = 10_000;
const MAX_DATABASE_GROWTH_BYTES = 20 * 1024 * 1024;
const STORAGE_LIMIT_BYTES = 512 * 1024 * 1024;
const MAX_MIGRATION_DATABASE_BYTES = STORAGE_LIMIT_BYTES + 48 * 1024 * 1024;
const COMPACTION_PAGES_PER_ROUND = 5;
const COMPACTION_PAGES_PER_VACUUM = 64;
const MIGRATION_LOCK = 'mini-dice.skill-log-migration';
const REQUIRED_INDEXES = [
  'PK_tb_skill_log_id',
  'TB_SKILL_LOG_USER_ID_CREATED_AT_IDX',
] as const;

type CompressionResult = {
  processedRows: number;
  skippedRows: number;
  failedRows: number;
  rawBytes: number;
  compressedBytes: number;
  compressionRatio: number | null;
  failures: { id: string; message: string }[];
  wroteRows: boolean;
};

type MigrationState = {
  database: string;
  serverVersion: number;
  totalRows: number;
  compressedRows: number;
  uncompressedRows: number;
  invalidRows: number;
  legacyValueRows: number;
  databaseBytes: number;
  tableBytes: number;
  indexBytes: number;
  totalRelationBytes: number;
};

type IndexState = {
  name: string;
  valid: boolean;
  ready: boolean;
  bytes: number;
};

export type MigrationProgress = MigrationState & {
  phase: string;
};

export type MigrationReporter = (
  progress: MigrationProgress,
) => void | Promise<void>;

type EncodedRow = {
  id: string;
  block: number;
  payload: Buffer;
  payloadCodec: number;
};

const COMPACTION_FUNCTION_SQL = `
  CREATE OR REPLACE FUNCTION pg_temp.compact_skill_log_pages(
    i_to_page integer,
    i_page_offset integer,
    i_max_tuples_per_page integer
  ) RETURNS integer
  LANGUAGE plpgsql AS $$
  DECLARE
    from_page integer := i_to_page - i_page_offset + 1;
    min_ctid tid := (from_page, 1)::text::tid;
    max_ctid tid := (i_to_page, i_max_tuples_per_page)::text::tid;
    ctid_list tid[];
    next_ctid_list tid[];
    moved_ctid tid;
    loop_count integer;
    result_page integer;
  BEGIN
    IF i_page_offset < 1 OR i_to_page < 1 OR i_to_page < i_page_offset THEN
      RAISE EXCEPTION 'Invalid page range';
    END IF;

    SELECT array_agg((page_number, tuple_number)::text::tid)
    INTO ctid_list
    FROM generate_series(from_page, i_to_page) AS page_number
    CROSS JOIN generate_series(1, i_max_tuples_per_page) AS tuple_number;

    <<move_rows>>
    FOR loop_count IN 1..i_max_tuples_per_page LOOP
      next_ctid_list := array[]::tid[];

      FOR moved_ctid IN
        UPDATE ONLY public.tb_skill_log
        SET "payloadCodec" = "payloadCodec"
        WHERE ctid = ANY(ctid_list)
        RETURNING ctid
      LOOP
        IF moved_ctid > max_ctid THEN
          result_page := -1;
          EXIT move_rows;
        ELSIF moved_ctid >= min_ctid THEN
          next_ctid_list := next_ctid_list || moved_ctid;
        END IF;
      END LOOP;

      ctid_list := next_ctid_list;
      IF coalesce(array_length(ctid_list, 1), 0) = 0 THEN
        result_page := from_page - 1;
        EXIT move_rows;
      END IF;
    END LOOP;

    IF loop_count = i_max_tuples_per_page AND result_page IS NULL THEN
      RAISE EXCEPTION 'Page compaction did not converge';
    END IF;

    RETURN result_page;
  END $$
`;

@Injectable()
export class SkillLogCompressionService {
  constructor(
    @InjectRepository(PgSkillLogEntity, DATASOURCE_NAMES.POSTGRESQL)
    private readonly skillLogRepository: Repository<PgSkillLogEntity>,
    @InjectDataSource(DATASOURCE_NAMES.POSTGRESQL)
    private readonly dataSource: DataSource,
  ) {}

  public async dryRun(): Promise<CompressionResult> {
    return await this.compress(false);
  }

  public async run(): Promise<CompressionResult> {
    const baseline = await this.getState();
    return await this.compress(true, baseline.databaseBytes);
  }

  public async check(expectedDatabase?: string) {
    await this.assertSchema();
    const [state, indexes, triggers] = await Promise.all([
      this.getState(),
      this.getIndexes(),
      this.getUserTriggers(),
    ]);

    if (expectedDatabase && state.database !== expectedDatabase) {
      throw new Error(
        `Connected to ${state.database}; expected ${expectedDatabase}`,
      );
    }
    if (state.serverVersion < 150000) {
      throw new Error('PostgreSQL 15 or newer is required');
    }
    if (state.invalidRows > 0 || state.legacyValueRows > 0) {
      throw new Error('Skill-log payload state is invalid');
    }
    if (triggers.length > 0) {
      throw new Error(`Enabled user triggers: ${triggers.join(', ')}`);
    }

    for (const name of REQUIRED_INDEXES) {
      const index = indexes.find((candidate) => candidate.name === name);
      if (!index?.valid || !index.ready) {
        throw new Error(`Required index is unavailable: ${name}`);
      }
    }
    if (indexes.some((index) => index.name === 'TB_SKILL_LOG_USER_ID_IDX')) {
      throw new Error('TypeORM migration must remove TB_SKILL_LOG_USER_ID_IDX');
    }

    return {
      mode: 'check' as const,
      ready: true,
      ...state,
      indexes,
      userTriggers: triggers,
      projectedReindexPeakBytes:
        state.databaseBytes + Math.max(...indexes.map((index) => index.bytes)),
    };
  }

  public async migrate(expectedDatabase: string, reporter?: MigrationReporter) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await this.acquireMigrationLock(queryRunner);
      const before = await this.check(expectedDatabase);
      const baselineMaxId = await this.getMaxId();

      await this.report('digest-before', reporter);
      const beforeDigest = await this.payloadDigest(baselineMaxId);

      await this.report('compression', reporter);
      const compression = await this.compress(
        true,
        before.databaseBytes,
        reporter,
      );
      if (compression.failedRows > 0) {
        throw new Error(
          `${compression.failedRows} payloads failed compression`,
        );
      }

      await this.report('compressed', reporter);
      await sleep(1500);

      await this.report('vacuum', reporter);
      await this.vacuum(queryRunner);

      await this.report('compaction', reporter);
      const compaction = await this.compact(queryRunner, reporter);

      const reindexed = await this.reindex(queryRunner, reporter);
      await queryRunner.query('ANALYZE public.tb_skill_log');

      await this.report('vacuumed', reporter);
      await sleep(250);
      await this.report('digest-after', reporter);
      const afterDigest = await this.payloadDigest(baselineMaxId);

      if (
        beforeDigest.rows !== afterDigest.rows ||
        beforeDigest.sha256 !== afterDigest.sha256
      ) {
        throw new Error('Decoded payload digest changed during migration');
      }

      const after = await this.check(expectedDatabase);
      if (
        after.uncompressedRows > 0 ||
        after.invalidRows > 0 ||
        after.legacyValueRows > 0
      ) {
        throw new Error('Skill-log migration is incomplete');
      }
      await this.report('verified', reporter);

      return {
        mode: 'run' as const,
        database: expectedDatabase,
        baselineMaxId,
        beforeDigest,
        afterDigest,
        compression,
        compaction,
        reindexed,
        final: after,
      };
    } finally {
      await queryRunner
        .query(`SELECT pg_advisory_unlock(hashtextextended($1, 0))`, [
          MIGRATION_LOCK,
        ])
        .catch(() => undefined);
      await queryRunner.release();
    }
  }

  private async compress(
    shouldWrite: boolean,
    baselineDatabaseBytes?: number,
    reporter?: MigrationReporter,
  ): Promise<CompressionResult> {
    const initialState = await this.getState();
    let processedRows = 0;
    let failedRows = 0;
    let rawBytes = 0;
    let compressedBytes = 0;
    const failures: { id: string; message: string }[] = [];
    let lastId: string | undefined;
    let nextProgressAt = Date.now() + PROGRESS_INTERVAL_MS;
    let rowsSinceVacuum = 0;

    while (true) {
      const query = this.skillLogRepository
        .createQueryBuilder('skillLog')
        .where('"skillLog"."payloadCodec" IS NULL')
        .orderBy('skillLog.id', 'ASC')
        .take(COMPRESSION_BATCH_SIZE);

      if (lastId) {
        query.andWhere('"skillLog"."id" > :lastId', { lastId });
      }

      const batch = await query
        .addSelect('"skillLog".ctid', 'skillLog_ctid')
        .getRawAndEntities();
      const rows = batch.entities;
      if (rows.length === 0) break;
      lastId = rows[rows.length - 1].id;

      const encodedRows: EncodedRow[] = [];
      let batchRawBytes = 0;
      let batchCompressedBytes = 0;

      for (const [index, row] of rows.entries()) {
        try {
          const ctid = String(batch.raw[index].skillLog_ctid);
          const block = Number(/^\((\d+),\d+\)$/.exec(ctid)?.[1]);
          if (!Number.isInteger(block)) {
            throw new Error(`Invalid ctid: ${ctid}`);
          }
          const sourcePayload = {
            userActivity: row.userActivity ?? null,
            skillServiceResult: row.skillServiceResult ?? null,
          };
          const encoded = encodeSkillLogPayload(sourcePayload);
          const decoded = decodeSkillLogPayload(
            encoded.payload,
            encoded.payloadCodec,
          );

          if (
            JSON.stringify(decoded.userActivity) !==
              JSON.stringify(sourcePayload.userActivity) ||
            JSON.stringify(decoded.skillServiceResult) !==
              JSON.stringify(sourcePayload.skillServiceResult)
          ) {
            throw new Error(
              'Encoded payload did not decode to original values',
            );
          }

          encodedRows.push({ id: row.id, block, ...encoded });
          batchRawBytes += Buffer.byteLength(
            JSON.stringify([
              sourcePayload.userActivity,
              sourcePayload.skillServiceResult,
            ]),
          );
          batchCompressedBytes += encoded.payload.byteLength;
        } catch (error) {
          failedRows += 1;
          failures.push({
            id: row.id,
            message: error instanceof Error ? error.message : String(error),
          });
          if (failures.length > 20) {
            throw new Error('Too many skill log compression failures');
          }
        }
      }

      if (shouldWrite && encodedRows.length > 0) {
        await this.writeBatch(encodedRows);
        rowsSinceVacuum += encodedRows.length;
        if (rowsSinceVacuum >= COMPRESSION_ROWS_PER_VACUUM) {
          await this.vacuumFromPool();
          rowsSinceVacuum = 0;
        }
        await sleep(BATCH_DELAY_MS);
      }

      processedRows += encodedRows.length;
      rawBytes += batchRawBytes;
      compressedBytes += batchCompressedBytes;

      if (Date.now() >= nextProgressAt) {
        const state = await this.report('compression', reporter);
        if (
          shouldWrite &&
          baselineDatabaseBytes !== undefined &&
          (state.databaseBytes >
            baselineDatabaseBytes + MAX_DATABASE_GROWTH_BYTES ||
            state.databaseBytes > MAX_MIGRATION_DATABASE_BYTES)
        ) {
          throw new Error('Migration paused at database growth guard');
        }
        nextProgressAt = Date.now() + PROGRESS_INTERVAL_MS;
      }
    }

    const finalState = await this.getState();
    if (
      shouldWrite &&
      baselineDatabaseBytes !== undefined &&
      (finalState.databaseBytes >
        baselineDatabaseBytes + MAX_DATABASE_GROWTH_BYTES ||
        finalState.databaseBytes > MAX_MIGRATION_DATABASE_BYTES)
    ) {
      throw new Error('Migration paused at database growth guard');
    }

    return {
      processedRows,
      skippedRows: initialState.compressedRows,
      failedRows,
      rawBytes,
      compressedBytes,
      compressionRatio:
        rawBytes > 0 ? Number((compressedBytes / rawBytes).toFixed(4)) : null,
      failures,
      wroteRows: shouldWrite,
    };
  }

  private async writeBatch(rows: EncodedRow[]) {
    const byBlock = new Map<number, EncodedRow[]>();
    for (const row of rows) {
      const blockRows = byBlock.get(row.block) ?? [];
      blockRows.push(row);
      byBlock.set(row.block, blockRows);
    }

    const blocks = [...byBlock.values()];
    const waveCount = Math.max(...blocks.map((blockRows) => blockRows.length));
    for (let index = 0; index < waveCount; index += 1) {
      const wave = blocks
        .map((blockRows) => blockRows[index])
        .filter((row): row is EncodedRow => row !== undefined);
      await this.writeRows(wave);
    }
  }

  private async writeRows(rows: EncodedRow[]) {
    const values = rows
      .map(
        (_, index) =>
          `($${index * 3 + 1}::uuid, $${index * 3 + 2}::bytea, $${
            index * 3 + 3
          }::smallint)`,
      )
      .join(', ');
    const parameters = rows.flatMap((row) => [
      row.id,
      row.payload,
      row.payloadCodec,
    ]);

    await this.dataSource.transaction(async (manager) => {
      await manager.query(`SET LOCAL lock_timeout = '1s'`);
      await manager.query(`SET LOCAL statement_timeout = '30s'`);
      const updated = await manager.query(
        `
          UPDATE public.tb_skill_log AS skill_log
          SET
            "payload" = encoded.payload,
            "payloadCodec" = encoded.codec,
            "userActivity" = NULL,
            "skillServiceResult" = NULL
          FROM (VALUES ${values}) AS encoded(id, payload, codec)
          WHERE skill_log.id = encoded.id
            AND skill_log."payloadCodec" IS NULL
          RETURNING skill_log.id
        `,
        parameters,
      );
      const updatedRows =
        Array.isArray(updated[0]) && typeof updated[1] === 'number'
          ? updated[0]
          : updated;

      if (updatedRows.length !== rows.length) {
        throw new Error(
          `Updated ${updatedRows.length} of ${rows.length} encoded skill logs`,
        );
      }
    });
  }

  private async compact(
    queryRunner: QueryRunner,
    reporter?: MigrationReporter,
  ) {
    await queryRunner.query(COMPACTION_FUNCTION_SQL);
    const initialPageCount = await this.getPageCount(queryRunner);
    const [{ maxTuplesPerPage }] = await queryRunner.query(`
      SELECT ceil(
        current_setting('block_size')::real / sum(attlen)
      )::integer AS "maxTuplesPerPage"
      FROM pg_catalog.pg_attribute
      WHERE attrelid = 'public.tb_skill_log'::regclass
        AND attnum < 0
    `);
    let toPage = initialPageCount - 1;
    let compactedPages = 0;
    let pagesSinceVacuum = 0;
    let nextProgressAt = Date.now() + PROGRESS_INTERVAL_MS;

    while (toPage > 1) {
      const pagesThisRound = Math.min(COMPACTION_PAGES_PER_ROUND, toPage);
      const previousPage = toPage;
      let nextPage: number;

      await queryRunner.startTransaction();
      try {
        await queryRunner.query(`SET LOCAL lock_timeout = '1s'`);
        await queryRunner.query(`SET LOCAL statement_timeout = '30s'`);
        const [result] = await queryRunner.query(
          `
            SELECT pg_temp.compact_skill_log_pages($1, $2, $3)
              AS "nextPage"
          `,
          [toPage, pagesThisRound, maxTuplesPerPage],
        );
        nextPage = result.nextPage;

        if (nextPage === -1) {
          await queryRunner.rollbackTransaction();
          break;
        }
        await queryRunner.commitTransaction();
      } catch (error) {
        if (queryRunner.isTransactionActive) {
          await queryRunner.rollbackTransaction();
        }
        throw error;
      }

      const movedPages = previousPage - nextPage;
      compactedPages += movedPages;
      pagesSinceVacuum += movedPages;
      toPage = nextPage;

      if (pagesSinceVacuum >= COMPACTION_PAGES_PER_VACUUM) {
        await this.vacuum(queryRunner);
        toPage = Math.min(toPage, (await this.getPageCount(queryRunner)) - 1);
        pagesSinceVacuum = 0;
      }

      if (Date.now() >= nextProgressAt) {
        await this.report('compaction', reporter);
        nextProgressAt = Date.now() + PROGRESS_INTERVAL_MS;
      }
      await sleep(BATCH_DELAY_MS);
    }

    await this.vacuum(queryRunner);
    return {
      initialPageCount,
      finalPageCount: await this.getPageCount(queryRunner),
      compactedPages,
    };
  }

  private async reindex(
    queryRunner: QueryRunner,
    reporter?: MigrationReporter,
  ) {
    const reindexed: string[] = [];

    for (const name of REQUIRED_INDEXES) {
      const state = await this.getState();
      const index = (await this.getIndexes()).find(
        (candidate) => candidate.name === name,
      );
      if (!index) throw new Error(`Missing index: ${name}`);
      if (state.databaseBytes + index.bytes > STORAGE_LIMIT_BYTES) {
        throw new Error(`Reindex storage guard reached for ${name}`);
      }

      await this.report(`reindex:${name}`, reporter);
      await queryRunner.query(`SET lock_timeout = '1s'`);
      await queryRunner.query(`REINDEX INDEX CONCURRENTLY public."${name}"`);
      reindexed.push(name);
    }

    return reindexed;
  }

  private async payloadDigest(maxId: string | null) {
    const hash = createHash('sha256');
    let lastId: string | undefined;
    let rows = 0;

    if (!maxId) return { rows, sha256: hash.digest('hex') };

    while (true) {
      const query = this.skillLogRepository
        .createQueryBuilder('skillLog')
        .where('skillLog.id <= :maxId', { maxId })
        .orderBy('skillLog.id', 'ASC')
        .take(DIGEST_BATCH_SIZE);
      if (lastId) query.andWhere('skillLog.id > :lastId', { lastId });

      const batch = await query.getMany();
      if (batch.length === 0) break;

      for (const row of batch) {
        const payload = this.decodedPayload(row);
        hash.update(row.id);
        hash.update('\0');
        hash.update(
          JSON.stringify([
            payload.userActivity ?? null,
            payload.skillServiceResult ?? null,
          ]),
        );
        hash.update('\n');
      }

      rows += batch.length;
      lastId = batch[batch.length - 1].id;
    }

    return { rows, sha256: hash.digest('hex') };
  }

  private async getMaxId(): Promise<string | null> {
    const rows = await this.dataSource.query(`
      SELECT id AS "maxId"
      FROM public.tb_skill_log
      ORDER BY id DESC
      LIMIT 1
    `);
    return rows[0]?.maxId ?? null;
  }

  private decodedPayload(row: PgSkillLogEntity) {
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

  private async assertSchema() {
    const rows = await this.dataSource.query(`
      SELECT column_name AS name
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'tb_skill_log'
        AND column_name IN ('payload', 'payloadCodec')
    `);
    if (rows.length !== 2) {
      throw new Error('Run the TypeORM skill-log payload migration first');
    }
  }

  private async getState(): Promise<MigrationState> {
    const [row] = await this.dataSource.query(`
      SELECT
        current_database() AS database,
        current_setting('server_version_num')::integer AS "serverVersion",
        count(*)::integer AS "totalRows",
        count(*) FILTER (WHERE "payloadCodec" IS NOT NULL)::integer
          AS "compressedRows",
        count(*) FILTER (WHERE "payloadCodec" IS NULL)::integer
          AS "uncompressedRows",
        count(*) FILTER (
          WHERE (payload IS NULL) <> ("payloadCodec" IS NULL)
        )::integer AS "invalidRows",
        count(*) FILTER (
          WHERE "payloadCodec" IS NOT NULL
            AND ("userActivity" IS NOT NULL OR "skillServiceResult" IS NOT NULL)
        )::integer AS "legacyValueRows",
        pg_database_size(current_database()) AS "databaseBytes",
        pg_table_size('public.tb_skill_log') AS "tableBytes",
        pg_indexes_size('public.tb_skill_log') AS "indexBytes",
        pg_total_relation_size('public.tb_skill_log') AS "totalRelationBytes"
      FROM public.tb_skill_log
    `);

    return Object.fromEntries(
      Object.entries(row).map(([key, value]) => [
        key,
        key === 'database' ? value : Number(value),
      ]),
    ) as MigrationState;
  }

  private async getIndexes(): Promise<IndexState[]> {
    const rows = await this.dataSource.query(`
      SELECT
        index_class.relname AS name,
        pg_index.indisvalid AS valid,
        pg_index.indisready AS ready,
        pg_relation_size(index_class.oid) AS bytes
      FROM pg_catalog.pg_index
      JOIN pg_catalog.pg_class AS index_class
        ON index_class.oid = pg_index.indexrelid
      WHERE pg_index.indrelid = 'public.tb_skill_log'::regclass
      ORDER BY index_class.relname
    `);

    return rows.map((row) => ({ ...row, bytes: Number(row.bytes) }));
  }

  private async getUserTriggers(): Promise<string[]> {
    const rows = await this.dataSource.query(`
      SELECT tgname AS name
      FROM pg_catalog.pg_trigger
      WHERE tgrelid = 'public.tb_skill_log'::regclass
        AND NOT tgisinternal
        AND tgenabled <> 'D'
      ORDER BY tgname
    `);
    return rows.map((row) => row.name);
  }

  private async acquireMigrationLock(queryRunner: QueryRunner) {
    const [{ locked }] = await queryRunner.query(
      `SELECT pg_try_advisory_lock(hashtextextended($1, 0)) AS locked`,
      [MIGRATION_LOCK],
    );
    if (!locked) throw new Error('Another skill-log migration is running');
  }

  private async vacuum(queryRunner: QueryRunner) {
    for (let attempt = 1; attempt <= 10; attempt += 1) {
      try {
        await queryRunner.query(`SET lock_timeout = '1s'`);
        await queryRunner.query(
          'VACUUM (INDEX_CLEANUP ON) public.tb_skill_log',
        );
        return;
      } catch (error) {
        if (
          attempt === 10 ||
          !String(error instanceof Error ? error.message : error).includes(
            'lock timeout',
          )
        ) {
          throw error;
        }
        await sleep(1000);
      }
    }
  }

  private async vacuumFromPool() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await this.vacuum(queryRunner);
    } finally {
      await queryRunner.release();
    }
  }

  private async getPageCount(queryRunner: QueryRunner) {
    const [{ pageCount }] = await queryRunner.query(`
      SELECT ceil(
        pg_relation_size('public.tb_skill_log')::numeric /
        current_setting('block_size')::integer
      )::integer AS "pageCount"
    `);
    return pageCount;
  }

  private async report(phase: string, reporter?: MigrationReporter) {
    const state = await this.getState();
    if (reporter) await reporter({ phase, ...state });
    return state;
  }
}
