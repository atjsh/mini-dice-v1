import { decode, encode } from '@msgpack/msgpack';
import { existsSync, readFileSync } from 'fs';
import * as path from 'path';
import { brotliCompressSync, brotliDecompressSync, constants } from 'zlib';

type DictionaryManifest = {
  latestCodec: number;
  codecs: number[];
};

export type PayloadDictionary = {
  codec: number;
  algorithm: 'msgpack-static-dict-brotli-q6';
  dictionaryVersion: number;
  extends: number | null;
  createdAt: string;
  keys: Record<string, string>;
};

export type SkillLogPayload = {
  userActivity: unknown;
  skillServiceResult: unknown;
};

const OBJECT_MARKER = -1;
const BROTLI_QUALITY = 6;

function isCompactedObjectEntry(
  value: unknown,
): value is [number | string, unknown] {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    ((typeof value[0] === 'number' && Number.isSafeInteger(value[0])) ||
      typeof value[0] === 'string')
  );
}

function isCompactedObjectEntries(
  value: unknown,
): value is [number | string, unknown][] {
  return Array.isArray(value) && value.every(isCompactedObjectEntry);
}

function isSkillLogPayloadTuple(value: unknown): value is [unknown, unknown] {
  return Array.isArray(value) && value.length === 2;
}

let manifestCache: DictionaryManifest | undefined;
const dictionaryCache = new Map<number, PayloadDictionary>();

function getGeneratedDirs() {
  return [
    path.resolve(__dirname, '../src/generated'),
    path.join(__dirname, 'generated'),
    path.join(__dirname, 'skill-log', 'generated'),
  ];
}

function readGeneratedJson<T>(fileName: string): T {
  const filePath = getGeneratedDirs()
    .map((dir) => path.join(dir, fileName))
    .find((candidate) => existsSync(candidate));

  if (!filePath) {
    throw new Error(`Skill log codec file not found: ${fileName}`);
  }

  return JSON.parse(readFileSync(filePath, 'utf8')) as T;
}

export function resetSkillLogCodecCaches() {
  manifestCache = undefined;
  dictionaryCache.clear();
}

export function getManifest(): DictionaryManifest {
  if (!manifestCache) {
    manifestCache = readGeneratedJson<DictionaryManifest>(
      'skill-log-payload-codecs.manifest.json',
    );
  }

  return manifestCache;
}

export function getDictionary(codec: number): PayloadDictionary {
  const cached = dictionaryCache.get(codec);
  if (cached) {
    return cached;
  }

  const dictionary = readGeneratedJson<PayloadDictionary>(
    `skill-log-payload-codec-${codec}.json`,
  );
  dictionaryCache.set(codec, dictionary);

  return dictionary;
}

function getLatestSkillLogPayloadCodec() {
  return getManifest().latestCodec;
}

function buildKeyToCode(dictionary: PayloadDictionary) {
  return Object.fromEntries(
    Object.entries(dictionary.keys).map(([code, key]) => [key, Number(code)]),
  ) as Record<string, number>;
}

function compactValue(
  value: unknown,
  keyToCode: Record<string, number>,
): unknown {
  if (value === undefined) {
    return null;
  }

  if (Array.isArray(value)) {
    return value.map((item) => compactValue(item, keyToCode));
  }

  if (typeof value === 'bigint') {
    return value.toString();
  }

  if (value && typeof value === 'object') {
    const pairs = Object.entries(value as Record<string, unknown>).map(
      ([key, child]) => [keyToCode[key] ?? key, compactValue(child, keyToCode)],
    );

    return [OBJECT_MARKER, pairs];
  }

  return value;
}

function expandValue(value: unknown, dictionary: PayloadDictionary): unknown {
  if (Array.isArray(value)) {
    if (value[0] === OBJECT_MARKER) {
      if (value.length !== 2 || !isCompactedObjectEntries(value[1])) {
        throw new Error('Invalid compacted skill log object');
      }

      return Object.fromEntries(
        value[1].map(([key, child]) => [
          typeof key === 'number'
            ? (dictionary.keys[String(key)] ?? String(key))
            : key,
          expandValue(child, dictionary),
        ]),
      );
    }

    return value.map((item) => expandValue(item, dictionary));
  }

  return value;
}

export function encodeSkillLogPayload(payload: SkillLogPayload) {
  const payloadCodec = getLatestSkillLogPayloadCodec();
  const dictionary = getDictionary(payloadCodec);
  const keyToCode = buildKeyToCode(dictionary);
  const compactedPayload = compactValue(
    [payload.userActivity ?? null, payload.skillServiceResult ?? null],
    keyToCode,
  );
  const msgpackBytes = encode(compactedPayload, { ignoreUndefined: true });
  const msgpackBuffer = Buffer.from(
    msgpackBytes.buffer,
    msgpackBytes.byteOffset,
    msgpackBytes.byteLength,
  );

  return {
    payloadCodec,
    payload: brotliCompressSync(msgpackBuffer, {
      params: {
        [constants.BROTLI_PARAM_QUALITY]: BROTLI_QUALITY,
      },
    }),
  };
}

export function decodeSkillLogPayload(
  payload: Buffer,
  payloadCodec: number,
): SkillLogPayload {
  const dictionary = getDictionary(payloadCodec);
  const msgpackBuffer = brotliDecompressSync(payload);
  const compactedPayload = decode(msgpackBuffer);
  const expandedPayload = expandValue(compactedPayload, dictionary);

  if (!isSkillLogPayloadTuple(expandedPayload)) {
    throw new Error(`Invalid skill log payload for codec ${payloadCodec}`);
  }

  return {
    userActivity: expandedPayload[0] ?? null,
    skillServiceResult: expandedPayload[1] ?? null,
  };
}
