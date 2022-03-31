import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookSkillGroup } from './book.skillgroup';

@Module({
  providers: [BookService, BookSkillGroup],
})
export class BookModule {}
