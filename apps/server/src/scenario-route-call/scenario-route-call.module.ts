import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import { Module } from '@nestjs/common';
import { ScenarioRouteCallService } from './scenario-route-call.service';

@Module({ imports: [DiscoveryModule], providers: [ScenarioRouteCallService] })
export class ScenarioRouteCallModule {}
