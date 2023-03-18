import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { FrontendErrorEntity } from './frontend-error.entity';

@Injectable()
export class FrontendErrorService {
  constructor(
    @InjectRepository(FrontendErrorEntity)
    private repository: Repository<FrontendErrorEntity>,
  ) {}

  async insert(error: string, userId: string) {
    await this.repository.save(this.repository.create({ error, userId }), {
      transaction: false,
      reload: false,
    });
  }
}
