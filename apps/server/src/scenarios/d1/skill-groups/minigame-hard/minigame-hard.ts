import { Injectable, Module } from '@nestjs/common';
import { SkillGroupController } from 'apps/server/src/skill-group-lib/skill-group-controller-factory';
import {
  IndexSkillPropsType,
  MethodReturnType,
  Skill,
  SkillDraw,
  SkillGroup,
  SkillPropsType,
  SkillServiceProps,
} from 'apps/server/src/skill-group-lib/skill-service-lib';
import {
  DiceUserActivitySkillDrawPropsType,
  InteractionUserActivitySkillDrawPropsType,
} from 'apps/server/src/skill-log/types/skill-draw-props.dto';
import { InteractionUserActivity } from 'apps/server/src/skill-log/types/user-activity.dto';
import { CommonMinigameModule } from '../../common/minigame/minigame.module';
import {
  CommonMinigameService,
  MinigameEasySubmitParamType,
} from '../../common/minigame/minigame.service';
import {
  commonMinigameIndexDraw,
  commonMinigameSubmitDraw,
} from '../../common/minigame/minigame.skillgroup';
import { D1ScenarioRoutes } from '../../routes';

const MAXIMUM_SCORE = 8;
const STARTING_EARNING_CASH = 20000;
const MINIGAME_NAME = '동전 던지기 고급';

@Injectable()
export class MinigameHardService {
  constructor(private commonMinigameService: CommonMinigameService) {}

  public async index(props: IndexSkillPropsType) {
    return this.commonMinigameService.commonIndex(
      props.userId,
      D1ScenarioRoutes.skillGroups.minigameHard.skills.submit,
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

@SkillGroup(D1ScenarioRoutes.skillGroups.minigameHard)
export class MinigameHardSkillGroup implements SkillGroupController {
  constructor(private minigameHardService: MinigameHardService) {}

  getSkillGroupAlias(): string | Promise<string> {
    return MINIGAME_NAME;
  }

  @Skill(D1ScenarioRoutes.skillGroups.minigameHard.skills.index)
  async index(props: IndexSkillPropsType) {
    return await this.minigameHardService.index(props);
  }

  @SkillDraw(D1ScenarioRoutes.skillGroups.minigameHard.skills.index)
  indexDraw(
    props: DiceUserActivitySkillDrawPropsType<
      MethodReturnType<MinigameHardService, 'index'>
    >,
  ) {
    return commonMinigameIndexDraw(
      props,
      MINIGAME_NAME,
      MAXIMUM_SCORE,
      D1ScenarioRoutes.skillGroups.minigameHard.skills.submit,
    );
  }

  @Skill(D1ScenarioRoutes.skillGroups.minigameHard.skills.submit)
  async submit(
    props: SkillPropsType<InteractionUserActivity<MinigameEasySubmitParamType>>,
  ) {
    return this.minigameHardService.submit({
      userId: props.userId,
      signedMinigameHistory: props.userActivity.params.signedMinigameHistory,
      move: props.userActivity.params.move,
    });
  }

  @SkillDraw(D1ScenarioRoutes.skillGroups.minigameHard.skills.submit)
  submitDraw(
    props: InteractionUserActivitySkillDrawPropsType<
      MethodReturnType<MinigameHardService, 'submit'>
    >,
  ) {
    return commonMinigameSubmitDraw(
      props,
      MINIGAME_NAME,
      MAXIMUM_SCORE,
      STARTING_EARNING_CASH,
      D1ScenarioRoutes.skillGroups.minigameHard.skills.submit,
    );
  }
}

@Module({
  imports: [CommonMinigameModule],
  providers: [MinigameHardService, MinigameHardSkillGroup],
})
export class MinigameHardModule {}
