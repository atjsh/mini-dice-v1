import { Controller } from '@nestjs/common';
import { StatInitService } from './stat-init/stat-init.service';

@Controller('stat')
export class StatController {
  constructor(private readonly statInitService: StatInitService) {}
}
