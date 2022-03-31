import { Injectable } from '@nestjs/common';
import { SkillServiceProps } from 'apps/server/src/skill-group-lib/skill-service-lib';
import { CommonLandService, LandIdEnum } from '../../common';
import { D1ScenarioRoutes } from '../../routes';

@Injectable()
export class Land2Service {
  constructor(private landService: CommonLandService) {}

  async getCurrentLandStatus() {
    return this.landService.getLandStatusById(LandIdEnum.LAND2);
  }

  async index(props: SkillServiceProps) {
    return this.landService.indexSkill({
      ...props,
      landSubmitSkillRoute: D1ScenarioRoutes.skillGroups.land2.skills.submit,
      landId: LandIdEnum.LAND2,
    });
  }

  async submit(props: SkillServiceProps<{ landName: string }>) {
    return this.landService.submitSkill({
      ...props,
      landId: LandIdEnum.LAND2,
    });
  }
}
