import * as esbuild from 'esbuild';
import { buildOptions } from './build-option.js';

await esbuild.build(buildOptions);
