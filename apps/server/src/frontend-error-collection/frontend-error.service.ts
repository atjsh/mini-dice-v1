import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FrontendErrorEntity } from './frontend-error.entity';

@Injectable()
export class FrontendErrorService {
  constructor(
    @InjectRepository(FrontendErrorEntity)
    private repository: Repository<FrontendErrorEntity>,
  ) {}

  async insert(error: string) {
    await this.repository.save(this.repository.create({ error }), {
      transaction: false,
      reload: false,
    });
  }
}
