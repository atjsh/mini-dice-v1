import { Injectable, Module } from '@nestjs/common';
import type { SkillGroupController } from '../../../../skill-group-lib/skill-group-controller-factory';
import type {
  IndexSkillPropsType,
  MethodReturnType,
  SkillPropsType,
  SkillServiceProps,
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
import { CommonMinigameModule } from '../../common/minigame/minigame.module';
import type {
  CommonMinigameService,
  MinigameEasySubmitParamType,
} from '../../common/minigame/minigame.service';
import {
  commonMinigameIndexDraw,
  commonMinigameSubmitDraw,
} from '../../common/minigame/minigame.skillgroup';
import { D1ScenarioRoutes } from '../../routes';

const MAXIMUM_SCORE = -1;
const STARTING_EARNING_CASH = 20000;
const MINIGAME_NAME = '동전 던지기 무한';

@Injectable()
export class MinigameInfinityService {
  constructor(private commonMinigameService: CommonMinigameService) {}

  public async index(props: IndexSkillPropsType) {
    return this.commonMinigameService.commonIndex(
      props.userId,
      D1ScenarioRoutes.skillGroups.minigameInfinity.skills.submit,
    );
  }

  public async submit(props: SkillServiceProps<MinigameEasySubmitParamType>) {
    return await this.commonMinigameService.commonSubmit(
      props.signedMinigameHistory,
      props.userId,
      props.move,
      STARTING_EARNING_CASH,
      MAXIMUM_SCORE,
    );
  }
}

@SkillGroup(D1ScenarioRoutes.skillGroups.minigameInfinity)
export class MinigameInfinitySkillGroup implements SkillGroupController {
  constructor(private minigameEasyService: MinigameInfinityService) {}

  getSkillGroupAlias(): string | Promise<string> {
    return MINIGAME_NAME;
  }

  @Skill(D1ScenarioRoutes.skillGroups.minigameInfinity.skills.index)
  async index(props: IndexSkillPropsType) {
    return await this.minigameEasyService.index(props);
  }

  @SkillDraw(D1ScenarioRoutes.skillGroups.minigameInfinity.skills.index)
  indexDraw(
    props: DiceUserActivitySkillDrawPropsType<
      MethodReturnType<MinigameInfinityService, 'index'>
    >,
  ) {
    return commonMinigameIndexDraw(
      props,
      MINIGAME_NAME,
      MAXIMUM_SCORE,
      D1ScenarioRoutes.skillGroups.minigameInfinity.skills.submit,
      false,
    );
  }

  @Skill(D1ScenarioRoutes.skillGroups.minigameInfinity.skills.submit)
  async submit(
    props: SkillPropsType<InteractionUserActivity<MinigameEasySubmitParamType>>,
  ) {
    return this.minigameEasyService.submit({
      userId: props.userId,
      signedMinigameHistory: props.userActivity.params.signedMinigameHistory,
      move: props.userActivity.params.move,
    });
  }

  @SkillDraw(D1ScenarioRoutes.skillGroups.minigameInfinity.skills.submit)
  submitDraw(
    props: InteractionUserActivitySkillDrawPropsType<
      MethodReturnType<MinigameInfinityService, 'submit'>
    >,
  ) {
    return commonMinigameSubmitDraw(
      props,
      MINIGAME_NAME,
      MAXIMUM_SCORE,
      STARTING_EARNING_CASH,
      D1ScenarioRoutes.skillGroups.minigameInfinity.skills.submit,
    );
  }
}

@Module({
  imports: [CommonMinigameModule],
  providers: [MinigameInfinityService, MinigameInfinitySkillGroup],
})
export class MinigameInfinityModule {}
