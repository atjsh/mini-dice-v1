import { DiscoveryService } from '@golevelup/nestjs-discovery';
import { Controller } from '@nestjs/common';

@Controller('scenarios/d1')
export class D1Controller {
  constructor(private discoveryService: DiscoveryService) {}
  async getAliases() {}
}
