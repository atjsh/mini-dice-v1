import * as esbuild from 'esbuild';
import path from 'path';
import { envCopy } from './env-copy.js';
import { esbuildProgressPulgin } from './esbuild-progress.js';
import { swcDecorators } from './swc-decorators.js';

const projectRoot = path.resolve(process.cwd(), '..', '..');

export const buildOptions = {
  entryPoints: [
    {
      in: `${projectRoot}/apps/server/src/main.ts`,
      out: 'index',
    },
  ],
  outdir: `${projectRoot}/apps/server/dist`,
  tsconfig: `${projectRoot}/apps/server/tsconfig.json`,
  format: 'esm',
  platform: 'node',
  target: 'node24',
  outExtension: { '.js': '.mjs' },
  bundle: true,
  minify: true,
  keepNames: true,
  legalComments: 'none',
  external: [
    '@nestjs/microservices',
    '@nestjs/platform-express',
    '@nestjs/websockets',
    '@fastify/static',
    '@fastify/view',
    '@mikro-orm/core',
    '@nestjs/mongoose',
    '@nestjs/sequelize',
  ],
  banner: {
    /** https://github.com/evanw/esbuild/issues/1921#issuecomment-1152991694 */
    js:
      "import{createRequire}from'module';const require=createRequire(import.meta.url);" +
      "import{fileURLToPath}from'node:url';import{dirname as __pathDirname}from'node:path';const __filename=fileURLToPath(import.meta.url);const __dirname=__pathDirname(__filename);",
  },
  plugins: [swcDecorators, esbuildProgressPulgin(), envCopy],
} satisfies esbuild.BuildOptions;
