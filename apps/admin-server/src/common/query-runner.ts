import type { QueryRunner } from 'typeorm';

export async function queryRunnerRows<Row extends Record<string, unknown>>(
  queryRunner: QueryRunner,
  query: string,
  parameters?: unknown[],
): Promise<Row[]> {
  const result: unknown = await queryRunner.query(query, parameters);

  if (!Array.isArray(result)) {
    throw new TypeError('Expected a database query to return rows');
  }

  return result as Row[];
}
