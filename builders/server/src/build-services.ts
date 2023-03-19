import { esbuildDecorators } from '@anatine/esbuild-decorators';
import * as esbuild from 'esbuild';
import path from 'path';
import { envCopy } from './env-copy.js';
import { esbuildProgressPulgin } from './esbuild-progress.js';

const projectRoot = path.resolve(process.cwd(), '..', '..');

const serviceBuildContext = await esbuild.context({
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
  target: 'node19',
  outExtension: { '.js': '.mjs' },
  bundle: true,
  minify: true,
  keepNames: false,
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
  plugins: [
    esbuildDecorators({
      tsconfig: `${projectRoot}/apps/server/tsconfig.json`,
    }),
    esbuildProgressPulgin(),
    envCopy,
  ],
  metafile: true,
});

await serviceBuildContext.watch();
