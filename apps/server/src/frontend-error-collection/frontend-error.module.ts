import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FrontendErrorController } from './frontend-error.controller';
import { FrontendErrorEntity } from './frontend-error.entity';
import { FrontendErrorService } from './frontend-error.service';

@Module({
  imports: [TypeOrmModule.forFeature([FrontendErrorEntity])],
  providers: [FrontendErrorService],
  controllers: [FrontendErrorController],
})
export class FrontendErrorModule {}
