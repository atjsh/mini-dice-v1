import * as esbuild from 'esbuild';
import { buildOptions } from './lib/build-option.js';

await esbuild.build(buildOptions);
