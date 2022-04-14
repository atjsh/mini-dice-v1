import { Controller, Post } from '@nestjs/common';
import { FrontendErrorService } from './frontend-error.service';

@Controller('frontend-error')
export class FrontendErrorController {
  constructor(private fronterrorService: FrontendErrorService) {}

  @Post()
  async insert(error: string) {
    await this.fronterrorService.insert(error);
  }
}
