import { Injectable } from '@nestjs/common';
import { SkillServiceProps } from 'apps/server/src/skill-group-lib/skill-service-lib';
import { UserRepository } from 'apps/server/src/user/user.repository';
import { getUserCanTossDice } from '../../../scenarios.commons';
import { SCENARIO_NAMES } from '../../../scenarios.constants';
import {
  CommonLandService,
  LandBuyingResult,
  LandIdEnum,
  LandBuyableByUserEnum,
} from '../../common/land/land.service';
import { D1ScenarioRoutes } from '../../routes';

@Injectable()
export class Land1Service {
  constructor(
    private landService: CommonLandService,
    private userRepository: UserRepository,
  ) {}

  async getCurrentLandStatus() {
    return this.landService.getLandStatusById(LandIdEnum.LAND1);
  }

  async index(props: SkillServiceProps) {
    const landStatus = await this.landService.getLandStatusById(
      LandIdEnum.LAND1,
    );
    const landBuyableByUserStatus = await this.landService.isLandBuyableByUser(
      landStatus,
      props.userId,
    );
    if (landBuyableByUserStatus.status == LandBuyableByUserEnum.BUYABLE) {
      await this.userRepository.setUserAllowedSkillRoute(
        props.userId,
        D1ScenarioRoutes.skillGroups.land1.skills.submit,
        false,
      );
    }

    await this.userRepository.setUserCanTossDice(
      props.userId,
      getUserCanTossDice(SCENARIO_NAMES.D1),
      false,
    );

    return {
      landStatus,
      landBuyableByUserStatus,
    };
  }

  async submit(props: SkillServiceProps<{ landName: string }>) {
    try {
      await this.landService.buyLand(
        LandIdEnum.LAND1,
        props.userId,
        props.landName,
      );
      return {
        landName: props.landName,
        buyingResult: LandBuyingResult.SUCCESS,
      };
    } catch (error) {
      return {
        landName: props.landName,
        buyingResult: LandBuyingResult.FAIL,
      };
    }
  }
}
