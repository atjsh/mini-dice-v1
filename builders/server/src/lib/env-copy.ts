import type { Plugin } from 'esbuild';
import path from 'path';
import fs from 'fs/promises';

const projectRoot = path.resolve(process.cwd(), '..', '..');

export const envCopy: Plugin = {
  name: 'env-copy',
  setup(build) {
    build.onEnd(async () => {
      await fs.copyFile(
        `${projectRoot}/apps/server/.env`,
        `${projectRoot}/apps/server/dist/.env`,
      );

      await fs.copyFile(
        `${projectRoot}/certs/supabase-prod.crt`,
        `${projectRoot}/apps/server/dist/supabase-prod.crt`,
      );

      await fs.cp(
        `${projectRoot}/packages/skill-log-codec/src/generated`,
        `${projectRoot}/apps/server/dist/skill-log/generated`,
        { recursive: true },
      );
    });
  },
};
