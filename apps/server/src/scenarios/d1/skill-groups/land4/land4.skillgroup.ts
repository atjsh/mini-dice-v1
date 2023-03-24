import type { SkillGroupController } from '../../../../skill-group-lib/skill-group-controller-factory';
import type {
  IndexSkillPropsType,
  MethodReturnType,
  SkillPropsType,
} from '../../../../skill-group-lib/skill-service-lib';
import {
  Skill,
  SkillDraw,
  SkillGroup,
} from '../../../../skill-group-lib/skill-service-lib';
import type {
  DiceUserActivitySkillDrawPropsType,
  InteractionUserActivitySkillDrawPropsType,
} from '../../../../skill-log/types/skill-draw-props.dto';
import type { InteractionUserActivity } from '../../../../skill-log/types/user-activity.dto';
import type { CommonLandServiceSubmitParamType } from '../../common';
import {
  commonLandSkillGroupWebIndexDraw,
  commonLandSkillGroupWebSubmitDraw,
  getCommonLandSkillGroupAlias,
} from '../../common';
import { D1ScenarioRoutes } from '../../routes';
import { Land4Service } from './land4.service';

@SkillGroup(D1ScenarioRoutes.skillGroups.land4)
export class Land4SkillGroup implements SkillGroupController {
  constructor(private skillService: Land4Service) {}

  async getSkillGroupAlias() {
    return getCommonLandSkillGroupAlias(
      await this.skillService.getCurrentLandStatus(),
    );
  }

  @Skill(D1ScenarioRoutes.skillGroups.land4.skills.index)
  async index(indexSkillProps: IndexSkillPropsType) {
    return await this.skillService.index(indexSkillProps);
  }

  @SkillDraw(D1ScenarioRoutes.skillGroups.land4.skills.index)
  async indexDraw(
    props: DiceUserActivitySkillDrawPropsType<
      MethodReturnType<Land4Service, 'index'>
    >,
  ) {
    return commonLandSkillGroupWebIndexDraw(
      props,
      D1ScenarioRoutes.skillGroups.land4.skills.submit,
    );
  }

  @Skill(D1ScenarioRoutes.skillGroups.land4.skills.submit)
  async submit({
    userId,
    userActivity,
  }: SkillPropsType<
    InteractionUserActivity<CommonLandServiceSubmitParamType>
  >) {
    return this.skillService.submit({
      userId,
      landName: userActivity.params.landName,
    });
  }

  @SkillDraw(D1ScenarioRoutes.skillGroups.land4.skills.submit)
  async webSubmitDraw(
    props: InteractionUserActivitySkillDrawPropsType<
      MethodReturnType<Land4Service, 'submit'>
    >,
  ) {
    return commonLandSkillGroupWebSubmitDraw(props);
  }
}
