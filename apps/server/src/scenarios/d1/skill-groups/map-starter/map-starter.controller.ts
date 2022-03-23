import { Body } from '@nestjs/common';
import { SkillGroup } from '@packages/scenario-routing';
import {
  MessageResponseFactory,
  UserActivityMessage,
  PlainMessage,
} from '@packages/shared-types';
import { SkillGroupController } from 'apps/server/src/skill-group-lib/skill-group-controller-factory';
import {
  DiceUserActivitySkillDrawPropsType,
  GameStartUserAcitvitySkillDrawPropsType,
} from 'apps/server/src/skill-log/types/skill-draw-props.dto';
import {
  SkillGroupAlias,
  WebIndexSkillDraw,
  MethodReturnType,
} from 'apps/server/src/skill-service-lib/skill-service-lib';
import { D1ScenarioRoutes } from '../../routes';
import { MapStarterService } from './map-starter.service';

@SkillGroup(D1ScenarioRoutes.skillGroups.mapStarter)
export class MapStarterController extends SkillGroupController<MapStarterService> {
  constructor(mapStarterService: MapStarterService) {
    super(mapStarterService);
  }

  @SkillGroupAlias()
  getSkillGroupAlias() {
    return '시작';
  }

  @WebIndexSkillDraw()
  async webIndexDraw(
    @Body()
    props:
      | DiceUserActivitySkillDrawPropsType<
          MethodReturnType<MapStarterService, 'index'>
        >
      | GameStartUserAcitvitySkillDrawPropsType,
  ) {
    if (props.userActivity.type == 'gameStart') {
      return MessageResponseFactory({
        userRequestDrawings: UserActivityMessage({
          type: 'interactionUserActivityMessage',
          title: '시작',
        }),
        date: props.date,
        actionResultDrawings: [
          PlainMessage({
            description: `주사위를 굴려 다음 칸으로 이동하세요.`,
          }),
        ],
      });
    } else {
      props as DiceUserActivitySkillDrawPropsType<
        MethodReturnType<MapStarterService, 'index'>
      >;

      return MessageResponseFactory({
        userRequestDrawings: this.drawDiceUserActivityMessage(
          props.userActivity,
        ),
        actionResultDrawings: [
          PlainMessage({
            title: `${this.getSkillGroupAlias()} 칸`,
            description: `${props.skillServiceResult?.rewarded_cash}원을 받았습니다. \n총 보유 금액: ${props.skillServiceResult?.currentCash}원`,
          }),
        ],
        date: props.date,
      });
    }
  }
}
