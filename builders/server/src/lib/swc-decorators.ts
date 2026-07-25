import { transform } from '@swc/core';
import type { Plugin } from 'esbuild';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const TYPESCRIPT_FILE = /\.[cm]?tsx?$/;

export const swcDecorators: Plugin = {
  name: 'swc-decorators',
  setup(build) {
    build.onLoad({ filter: TYPESCRIPT_FILE }, async ({ path: filePath }) => {
      const source = await readFile(filePath, 'utf8');
      const transformed = await transform(source, {
        filename: filePath,
        sourceMaps: 'inline',
        module: {
          type: 'es6',
        },
        jsc: {
          target: 'es2024',
          keepClassNames: true,
          parser: {
            syntax: 'typescript',
            tsx: filePath.endsWith('.tsx'),
            decorators: true,
          },
          transform: {
            legacyDecorator: true,
            decoratorMetadata: true,
          },
        },
      });

      return {
        contents: transformed.code,
        loader: 'js',
        resolveDir: path.dirname(filePath),
        watchFiles: [filePath],
      };
    });
  },
};
