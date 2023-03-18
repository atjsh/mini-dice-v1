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
import {
  CommonMinigameService,
  type MinigameEasySubmitParamType,
} from '../../common/minigame/minigame.service';
import {
  commonMinigameIndexDraw,
  commonMinigameSubmitDraw,
} from '../../common/minigame/minigame.skillgroup';
import { D1ScenarioRoutes } from '../../routes';

const MAXIMUM_SCORE = 3;
const STARTING_EARNING_CASH = 4000;
const MINIGAME_NAME = '동전 던지기 중급';

@Injectable()
export class MinigameEasyService {
  constructor(private commonMinigameService: CommonMinigameService) {}

  public async index(props: IndexSkillPropsType) {
    return this.commonMinigameService.commonIndex(
      props.userId,
      D1ScenarioRoutes.skillGroups.minigameEasy.skills.submit,
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

@SkillGroup(D1ScenarioRoutes.skillGroups.minigameEasy)
export class MinigameEasySkillGroup implements SkillGroupController {
  constructor(private minigameEasyService: MinigameEasyService) {}

  getSkillGroupAlias(): string | Promise<string> {
    return MINIGAME_NAME;
  }

  @Skill(D1ScenarioRoutes.skillGroups.minigameEasy.skills.index)
  async index(props: IndexSkillPropsType) {
    return await this.minigameEasyService.index(props);
  }

  @SkillDraw(D1ScenarioRoutes.skillGroups.minigameEasy.skills.index)
  indexDraw(
    props: DiceUserActivitySkillDrawPropsType<
      MethodReturnType<MinigameEasyService, 'index'>
    >,
  ) {
    return commonMinigameIndexDraw(
      props,
      MINIGAME_NAME,
      MAXIMUM_SCORE,
      D1ScenarioRoutes.skillGroups.minigameEasy.skills.submit,
    );
  }

  @Skill(D1ScenarioRoutes.skillGroups.minigameEasy.skills.submit)
  async submit(
    props: SkillPropsType<InteractionUserActivity<MinigameEasySubmitParamType>>,
  ) {
    return this.minigameEasyService.submit({
      userId: props.userId,
      signedMinigameHistory: props.userActivity.params.signedMinigameHistory,
      move: props.userActivity.params.move,
    });
  }

  @SkillDraw(D1ScenarioRoutes.skillGroups.minigameEasy.skills.submit)
  submitDraw(
    props: InteractionUserActivitySkillDrawPropsType<
      MethodReturnType<MinigameEasyService, 'submit'>
    >,
  ) {
    return commonMinigameSubmitDraw(
      props,
      MINIGAME_NAME,
      MAXIMUM_SCORE,
      STARTING_EARNING_CASH,
      D1ScenarioRoutes.skillGroups.minigameEasy.skills.submit,
    );
  }
}

@Module({
  imports: [CommonMinigameModule],
  providers: [MinigameEasyService, MinigameEasySkillGroup],
})
export class MinigameEasyModule {}
