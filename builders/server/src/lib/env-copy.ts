import type { Plugin } from 'esbuild';
import path from 'path';
import fs from 'fs/promises';

const projectRoot = path.resolve(process.cwd(), '..', '..');

export const envCopy: Plugin = {
  name: 'env-copy',
  setup(build) {
    build.onEnd(async () => {
      fs.copyFile(
        `${projectRoot}/apps/server/.env`,
        `${projectRoot}/apps/server/dist/.env`,
      );
    });
  },
};
