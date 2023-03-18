import { Injectable } from '@nestjs/common';
import type { CommonLandService } from '../../common';
import { LandIdEnum } from '../../common';
import { D1ScenarioRoutes } from '../../routes';
import type { SkillServiceProps } from '../../../../skill-group-lib/skill-service-lib';

@Injectable()
export class Land6Service {
  constructor(private landService: CommonLandService) {}

  async getCurrentLandStatus() {
    return this.landService.getLandStatusById(LandIdEnum.LAND6);
  }

  async index(props: SkillServiceProps) {
    return this.landService.indexSkill({
      ...props,
      landSubmitSkillRoute: D1ScenarioRoutes.skillGroups.land6.skills.submit,
      landId: LandIdEnum.LAND6,
    });
  }

  async submit(props: SkillServiceProps<{ landName: string }>) {
    return this.landService.submitSkill({
      ...props,
      landId: LandIdEnum.LAND6,
    });
  }
}
