import { SkillGroupController } from '../../../../skill-group-lib/skill-group-controller-factory';
import {
  IndexSkillPropsType,
  MethodReturnType,
  Skill,
  SkillDraw,
  SkillGroup,
  SkillPropsType,
} from '../../../../skill-group-lib/skill-service-lib';
import {
  DiceUserActivitySkillDrawPropsType,
  InteractionUserActivitySkillDrawPropsType,
} from '../../../../skill-log/types/skill-draw-props.dto';
import { InteractionUserActivity } from '../../../../skill-log/types/user-activity.dto';
import {
  CommonLandServiceSubmitParamType,
  commonLandSkillGroupWebIndexDraw,
  commonLandSkillGroupWebSubmitDraw,
  getCommonLandSkillGroupAlias,
} from '../../common';
import { D1ScenarioRoutes } from '../../routes';
import { Land2Service } from './land2.service';

@SkillGroup(D1ScenarioRoutes.skillGroups.land2)
export class Land2SkillGroup implements SkillGroupController {
  constructor(private skillService: Land2Service) {}

  async getSkillGroupAlias() {
    return getCommonLandSkillGroupAlias(
      await this.skillService.getCurrentLandStatus(),
    );
  }

  @Skill(D1ScenarioRoutes.skillGroups.land2.skills.index)
  async index(indexSkillProps: IndexSkillPropsType) {
    return await this.skillService.index(indexSkillProps);
  }

  @SkillDraw(D1ScenarioRoutes.skillGroups.land2.skills.index)
  async indexDraw(
    props: DiceUserActivitySkillDrawPropsType<
      MethodReturnType<Land2Service, 'index'>
    >,
  ) {
    return commonLandSkillGroupWebIndexDraw(
      props,
      D1ScenarioRoutes.skillGroups.land2.skills.submit,
    );
  }

  @Skill(D1ScenarioRoutes.skillGroups.land2.skills.submit)
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

  @SkillDraw(D1ScenarioRoutes.skillGroups.land2.skills.submit)
  async webSubmitDraw(
    props: InteractionUserActivitySkillDrawPropsType<
      MethodReturnType<Land2Service, 'submit'>
    >,
  ) {
    return commonLandSkillGroupWebSubmitDraw(props);
  }
}
