import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
import { DataSource } from 'typeorm';
import { postgresOptions } from './postgres-database';

if (existsSync('.env')) {
  loadEnvFile('.env');
}

export default new DataSource(postgresOptions());
