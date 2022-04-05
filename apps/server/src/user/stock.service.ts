import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class StockService {
  constructor(private userRepository: UserRepository) {}
}
