import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { postgresOptions } from './postgres-database';

ConfigModule.forRoot({ envFilePath: '.env' });

export default new DataSource(postgresOptions());
