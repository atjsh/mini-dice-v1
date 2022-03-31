import { SkillGroupController } from 'apps/server/src/skill-group-lib/skill-group-controller-factory';
import {
  SkillGroup,
  Skill,
  IndexSkillPropsType,
  SkillDraw,
  MethodReturnType,
  SkillPropsType,
} from 'apps/server/src/skill-group-lib/skill-service-lib';
import {
  DiceUserActivitySkillDrawPropsType,
  InteractionUserActivitySkillDrawPropsType,
} from 'apps/server/src/skill-log/types/skill-draw-props.dto';
import { InteractionUserActivity } from 'apps/server/src/skill-log/types/user-activity.dto';
import {
  getCommonLandSkillGroupAlias,
  commonLandSkillGroupWebIndexDraw,
  CommonLandServiceSubmitParamType,
  commonLandSkillGroupWebSubmitDraw,
} from '../../common';
import { D1ScenarioRoutes } from '../../routes';
import { Land3Service } from './land3.service';

@SkillGroup(D1ScenarioRoutes.skillGroups.land3)
export class Land3SkillGroup implements SkillGroupController {
  constructor(private skillService: Land3Service) {}

  async getSkillGroupAlias() {
    return getCommonLandSkillGroupAlias(
      await this.skillService.getCurrentLandStatus(),
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
