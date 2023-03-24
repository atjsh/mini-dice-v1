import * as esbuild from 'esbuild';
import { buildOptions } from './build-option.js';

const serviceBuildContext = await esbuild.context(buildOptions);

await serviceBuildContext.watch();
