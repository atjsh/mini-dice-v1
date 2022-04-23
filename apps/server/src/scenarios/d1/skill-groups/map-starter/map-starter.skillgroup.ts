import {
  cashLocale,
  MessageResponseFactory,
  PlainMessage,
  UserActivityMessage,
} from '@packages/shared-types';
import { SkillGroupController } from 'apps/server/src/skill-group-lib/skill-group-controller-factory';
import {
  drawDiceUserActivityMessage,
  IndexSkillPropsType,
  MethodReturnType,
  Skill,
  SkillDraw,
  SkillGroup,
} from 'apps/server/src/skill-group-lib/skill-service-lib';
import {
  DiceUserActivitySkillDrawPropsType,
  GameStartUserAcitvitySkillDrawPropsType,
} from 'apps/server/src/skill-log/types/skill-draw-props.dto';
import { getStopImageUrl } from '../../../scenarios.commons';
import { D1ScenarioRoutes } from '../../routes';
import { MapStarterService } from './map-starter.service';

@SkillGroup(D1ScenarioRoutes.skillGroups.mapStarter)
export class MapStarterSkillGroup implements SkillGroupController {
  constructor(private skillService: MapStarterService) {}

  getSkillGroupAlias() {
    return '시작';
  }

  @Skill(D1ScenarioRoutes.skillGroups.mapStarter.skills.index)
  async index(indexSkillProps: IndexSkillPropsType) {
    return await this.skillService.index(indexSkillProps);
  }

  @SkillDraw(D1ScenarioRoutes.skillGroups.mapStarter.skills.index)
  async indexDraw(
    props:
      | DiceUserActivitySkillDrawPropsType<
          MethodReturnType<MapStarterService, 'index'>
        >
      | GameStartUserAcitvitySkillDrawPropsType,
  ) {
    if (props.userActivity.type == 'gameStart') {
      return MessageResponseFactory({
        userRequestDrawings: [
          UserActivityMessage({
            type: 'interactionUserActivityMessage',
            title: '시작',
          }),
        ],
        date: props.date,
        actionResultDrawings: [
          PlainMessage({
            thumbnail: {
              altName: '시작 일러스트',
              imageUrl: getStopImageUrl(
                D1ScenarioRoutes.skillGroups.mapStarter.skillGroupName,
              ),
            },
            title: '미니다이스 인생게임에 오신 것을 환영합니다!',
            description: `"🎲 주사위 굴리기" 버튼을 계속 눌러 진행하세요!`,
          }),
        ],
      });
    } else {
      props as DiceUserActivitySkillDrawPropsType<
        MethodReturnType<MapStarterService, 'index'>
      >;

      return MessageResponseFactory({
        userRequestDrawings: drawDiceUserActivityMessage(props.userActivity),
        actionResultDrawings: [
          PlainMessage({
            thumbnail: {
              altName: '시작 일러스트',
              imageUrl: getStopImageUrl(
                D1ScenarioRoutes.skillGroups.mapStarter.skillGroupName,
              ),
            },
            title: `시작 칸`,
            description: '시작 칸에 도착했습니다.',
          }),
          PlainMessage({
            title: '고생했어요',
            description: `기념으로 ${cashLocale(
              props.skillServiceResult?.rewarded_cash,
            )} 받았습니다.`,
          }),
        ],
        date: props.date,
      });
    }
  }
}
