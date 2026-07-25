import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  decodeSkillLogPayload,
  getDictionary,
  getManifest,
  resetSkillLogCodecCaches,
  type PayloadDictionary,
} from '@packages/skill-log-codec';
import fs from 'fs/promises';
import * as path from 'path';
import { Repository } from 'typeorm';
import { DATASOURCE_NAMES } from '../../common/datasource-names';
import { PgSkillLogEntity } from '../../entities/postgresql/pg-skill-log.entity';

const SCAN_BATCH_SIZE = 1000;
const GENERATED_DIR = path.resolve(
  __dirname,
  '../../../../../packages/skill-log-codec/src/generated',
);

type DictionaryGenerationResult = {
  scannedRows: number;
  compressedRows: number;
  rawRows: number;
  codecVersionsSeen: number[];
  knownKeyCount: number;
  discoveredKeyCount: number;
  newKeys: string[];
  newCodec: number | null;
  wroteFiles: boolean;
};

function collectObjectKeyCounts(
  value: unknown,
  counts = new Map<string, number>(),
) {
  if (Array.isArray(value)) {
    value.forEach((item) => collectObjectKeyCounts(item, counts));
  } else if (value && typeof value === 'object') {
    Object.entries(value as Record<string, unknown>).forEach(([key, child]) => {
      counts.set(key, (counts.get(key) ?? 0) + 1);
      collectObjectKeyCounts(child, counts);
    });
  }

  return counts;
}

@Injectable()
export class SkillLogDictionaryGeneratorService {
  constructor(
    @InjectRepository(PgSkillLogEntity, DATASOURCE_NAMES.POSTGRESQL)
    private readonly skillLogRepository: Repository<PgSkillLogEntity>,
  ) {}

  public async dryRun(): Promise<DictionaryGenerationResult> {
    return await this.generate(false);
  }

  public async generateAndWrite(): Promise<DictionaryGenerationResult> {
    return await this.generate(true);
  }

  private async generate(
    shouldWrite: boolean,
  ): Promise<DictionaryGenerationResult> {
    const keyCounts = new Map<string, number>();
    const codecVersionsSeen = new Set<number>();
    let scannedRows = 0;
    let compressedRows = 0;
    let rawRows = 0;
    let lastId: string | undefined;

    while (true) {
      const query = this.skillLogRepository
        .createQueryBuilder('skillLog')
        .orderBy('skillLog.id', 'ASC')
        .take(SCAN_BATCH_SIZE);

      if (lastId) {
        query.where('"skillLog"."id" > :lastId', { lastId });
      }

      const rows = await query.getMany();

      if (rows.length === 0) {
        break;
      }

      const lastRow = rows[rows.length - 1];
      lastId = lastRow.id;

      rows.forEach((row) => {
        scannedRows += 1;

        if (row.payload && row.payloadCodec) {
          const decodedPayload = decodeSkillLogPayload(
            row.payload,
            row.payloadCodec,
          );
          codecVersionsSeen.add(row.payloadCodec);
          compressedRows += 1;
          collectObjectKeyCounts(decodedPayload.userActivity, keyCounts);
          collectObjectKeyCounts(decodedPayload.skillServiceResult, keyCounts);
          return;
        }

        rawRows += 1;
        collectObjectKeyCounts(row.userActivity, keyCounts);
        collectObjectKeyCounts(row.skillServiceResult, keyCounts);
      });
    }

    const manifest = getManifest();
    const latestDictionary = getDictionary(manifest.latestCodec);
    const existingKeys = new Set(Object.values(latestDictionary.keys));
    const discoveredKeys = [...keyCounts.keys()].sort();
    const newKeys = discoveredKeys.filter((key) => !existingKeys.has(key));
    const newCodec =
      newKeys.length > 0 ? Math.max(...manifest.codecs) + 1 : null;

    if (shouldWrite && newCodec) {
      await this.writeNewCodecFiles({
        manifest,
        latestDictionary,
        newCodec,
        newKeys,
      });
      resetSkillLogCodecCaches();
    }

    return {
      scannedRows,
      compressedRows,
      rawRows,
      codecVersionsSeen: [...codecVersionsSeen].sort((a, b) => a - b),
      knownKeyCount: existingKeys.size,
      discoveredKeyCount: discoveredKeys.length,
      newKeys,
      newCodec,
      wroteFiles: shouldWrite && Boolean(newCodec),
    };
  }

  private async writeNewCodecFiles({
    manifest,
    latestDictionary,
    newCodec,
    newKeys,
  }: {
    manifest: { latestCodec: number; codecs: number[] };
    latestDictionary: PayloadDictionary;
    newCodec: number;
    newKeys: string[];
  }) {
    const existingCodes = Object.keys(latestDictionary.keys).map(Number);
    let nextCode = Math.max(...existingCodes, 0) + 1;
    const keys = { ...latestDictionary.keys };

    newKeys.forEach((key) => {
      keys[String(nextCode)] = key;
      nextCode += 1;
    });

    const nextDictionary: PayloadDictionary = {
      codec: newCodec,
      algorithm: latestDictionary.algorithm,
      dictionaryVersion: newCodec,
      extends: latestDictionary.codec,
      createdAt: new Date().toISOString(),
      keys,
    };

    const nextManifest = {
      latestCodec: newCodec,
      codecs: [...manifest.codecs, newCodec],
    };

    await fs.mkdir(GENERATED_DIR, { recursive: true });
    await Promise.all([
      fs.writeFile(
        path.join(GENERATED_DIR, `skill-log-payload-codec-${newCodec}.json`),
        `${JSON.stringify(nextDictionary, null, 2)}\n`,
      ),
      fs.writeFile(
        path.join(GENERATED_DIR, 'skill-log-payload-codecs.manifest.json'),
        `${JSON.stringify(nextManifest, null, 2)}\n`,
      ),
    ]);
  }
}
