import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DATASOURCE_NAMES } from './common/datasource-names';
import { postgresOptions } from './config/postgres-database';
import { GLOBAL_CONFIG_MODULES } from './enviroment-variable-config';
import { PgOnlyMigratorModule } from './migrator/pg-only-migrator.module';
import { StatModule } from './stat/stat.module';

@Module({
  imports: [
    ...GLOBAL_CONFIG_MODULES,

    TypeOrmModule.forRootAsync({
      name: DATASOURCE_NAMES.POSTGRESQL,
      useFactory: postgresOptions,
    }),

    PgOnlyMigratorModule,
    StatModule,
  ],
})
export class AppModule {}
