import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSkillLogPayload1783700000000 implements MigrationInterface {
  name = 'AddSkillLogPayload1783700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`SET LOCAL lock_timeout = '1s'`);
    await queryRunner.query(`
      ALTER TABLE public.tb_skill_log
        ADD COLUMN "payload" bytea,
        ADD COLUMN "payloadCodec" smallint
    `);
    await queryRunner.query(`
      COMMENT ON COLUMN public.tb_skill_log."payload" IS
        'Compressed MessagePack skill log payload containing userActivity and skillServiceResult.'
    `);
    await queryRunner.query(`
      COMMENT ON COLUMN public.tb_skill_log."payloadCodec" IS
        'Small integer codec id mapped by application dictionary JSON files.'
    `);
    await queryRunner.query(`
      DROP INDEX IF EXISTS public."TB_SKILL_LOG_USER_ID_IDX"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`SET LOCAL lock_timeout = '1s'`);
    const [{ compressedRows }] = await queryRunner.query(`
      SELECT count(*)::integer AS "compressedRows"
      FROM public.tb_skill_log
      WHERE "payloadCodec" IS NOT NULL
    `);

    if (compressedRows > 0) {
      throw new Error('Compressed skill logs must be restored before rollback');
    }

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "TB_SKILL_LOG_USER_ID_IDX"
      ON public.tb_skill_log ("userId")
    `);
    await queryRunner.query(`
      ALTER TABLE public.tb_skill_log
        DROP COLUMN "payloadCodec",
        DROP COLUMN "payload"
    `);
  }
}
