import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserActivityEntity } from './user-activity.entity';

@Injectable()
export class UserActivityService {
  constructor(
    @InjectRepository(UserActivityEntity)
    private userActivityRepository: Repository<UserActivityEntity>,
  ) {}
}
