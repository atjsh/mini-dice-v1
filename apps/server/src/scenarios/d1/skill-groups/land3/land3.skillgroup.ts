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
import type { Land3Service } from './land3.service';

@SkillGroup(D1ScenarioRoutes.skillGroups.land3)
export class Land3SkillGroup implements SkillGroupController {
  constructor(private skillService: Land3Service) {}

  async getSkillGroupAlias() {
    return getCommonLandSkillGroupAlias(
      await this.skillService.getCurrentLandStatus(),
      '황금',
    );
  }

  @Skill(D1ScenarioRoutes.skillGroups.land3.skills.index)
  async index(indexSkillProps: IndexSkillPropsType) {
    return await this.skillService.index(indexSkillProps);
  }

  @SkillDraw(D1ScenarioRoutes.skillGroups.land3.skills.index)
  async indexDraw(
    props: DiceUserActivitySkillDrawPropsType<
      MethodReturnType<Land3Service, 'index'>
    >,
  ) {
    return commonLandSkillGroupWebIndexDraw(
      props,
      D1ScenarioRoutes.skillGroups.land3.skills.submit,
    );
  }

  @Skill(D1ScenarioRoutes.skillGroups.land3.skills.submit)
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

  @SkillDraw(D1ScenarioRoutes.skillGroups.land3.skills.submit)
  async webSubmitDraw(
    props: InteractionUserActivitySkillDrawPropsType<
      MethodReturnType<Land3Service, 'submit'>
    >,
  ) {
    return commonLandSkillGroupWebSubmitDraw(props);
  }
}
