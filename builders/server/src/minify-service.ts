import swc from '@swc/core';
import { writeFile, readFile } from 'fs/promises';
import path from 'path';

const { code } = await swc.minify(
  (
    await readFile(
      `${path.resolve(process.cwd(), '..', '..')}/apps/server/dist/index.mjs`,
    )
  ).toString(),
  {
    compress: true,
    module: true,
    mangle: true,
  },
);

await writeFile(
  `${path.resolve(process.cwd(), '..', '..')}/apps/server/dist/index.min.mjs`,
  code,
);
