import {
  cashLocale,
  MessageResponseFactory,
  PlainMessage,
} from '@packages/shared-types';
import type { SkillGroupController } from '../../../../skill-group-lib/skill-group-controller-factory';
import type {
  IndexSkillPropsType,
  MethodReturnType,
} from '../../../../skill-group-lib/skill-service-lib';
import {
  drawDiceUserActivityMessage,
  Skill,
  SkillDraw,
  SkillGroup,
} from '../../../../skill-group-lib/skill-service-lib';
import type { DiceUserActivitySkillDrawPropsType } from '../../../../skill-log/types/skill-draw-props.dto';
import { D1ScenarioRoutes } from '../../routes';
import type { MoneyCollection3Service } from './money-collection-3.service';
import {
  moneyCollection3Fee,
  moneyCollection3ReceiveAtCount,
  MoneyCollection3ResultEnum,
} from './money-collection-3.service';

@SkillGroup(D1ScenarioRoutes.skillGroups.moneyCollection3)
export class MoneyCollection3SkillGroup implements SkillGroupController {
  constructor(private skillService: MoneyCollection3Service) {}

  getSkillGroupAlias(): string | Promise<string> {
    return '일확천금 노리기';
  }

  @Skill(D1ScenarioRoutes.skillGroups.moneyCollection3.skills.index)
  async index(indexSkillProps: IndexSkillPropsType) {
    return await this.skillService.index(indexSkillProps);
  }

  @SkillDraw(D1ScenarioRoutes.skillGroups.moneyCollection3.skills.index)
  async indexDraw(
    props: DiceUserActivitySkillDrawPropsType<
      MethodReturnType<MoneyCollection3Service, 'index'>
    >,
  ) {
    return MessageResponseFactory({
      userRequestDrawings: drawDiceUserActivityMessage(props.userActivity),
      date: props.date,
      actionResultDrawings: [
        PlainMessage({
          title: '일확천금 노리기 칸',
          description: `일확천금 노리기 칸에 도착했습니다. \n이 칸에 도착할 때마다 이 곳에 ${cashLocale(
            moneyCollection3Fee,
          )} 내고, 이 곳에 돈이 ${cashLocale(
            moneyCollection3Fee * moneyCollection3ReceiveAtCount,
          )} 모였을 때 도착하면 모인 돈을 받아갈 수 있습니다.`,
        }),
        ...(() => {
          switch (props.skillServiceResult.result) {
            case MoneyCollection3ResultEnum.PAYED:
              return [
                PlainMessage({
                  title: "'일확천금 노리기' 입금 내역은 다음과 같습니다.",
                  description: `${
                    props.skillServiceResult.usernames &&
                    props.skillServiceResult.usernames.length > 0
                      ? `총 ${
                          props.skillServiceResult.usernames.length
                        }명: ${props.skillServiceResult.usernames.join(', ')}`
                      : '(아직 입금자가 없습니다)'
                  }`,
                }),
                PlainMessage({
                  title: '돈을 냈습니다',
                  description: `총 ${cashLocale(
                    (props.skillServiceResult.usernamesLength ?? 1) *
                      moneyCollection3Fee,
                  )} 모여있는 상태입니다. ${cashLocale(
                    props.skillServiceResult.payedCash,
                  )} 냈습니다. \n이제 여기에 ${cashLocale(
                    ((props.skillServiceResult.usernamesLength ?? 1) + 1) *
                      moneyCollection3Fee,
                  )} 모였습니다.`,
                }),
              ];
            case MoneyCollection3ResultEnum.RECIEVED:
              return [
                PlainMessage({
                  title: "'일확천금 노리기' 입금 내역은 다음과 같습니다.",
                  description: `${
                    props.skillServiceResult.usernames &&
                    props.skillServiceResult.usernames.length > 0
                      ? `총 ${
                          props.skillServiceResult.usernames.length
                        }명: ${props.skillServiceResult.usernames.join(', ')}`
                      : '(아직 입금자가 없습니다)'
                  }`,
                }),
                PlainMessage({
                  title: '돈을 가져갔습니다.',
                  description: `현재 여기에 총 ${cashLocale(
                    props.skillServiceResult.earnedCash,
                  )} 모여 있습니다. 당신은 일확천금 노리기에 성공했습니다!\n${cashLocale(
                    props.skillServiceResult.earnedCash,
                  )} 가져갔습니다.`,
                }),
              ];
            case MoneyCollection3ResultEnum.SKIPPED:
              return [
                PlainMessage({
                  title: '스킵되었어요',
                  description: `당신이 보유중인 돈이 부족하기 때문에 아무것도 하지 않았습니다. 현재 ${cashLocale(
                    (props.skillServiceResult.usernamesLength ?? 1) *
                      moneyCollection3Fee,
                  )} 모여 있습니다.`,
                }),
              ];
          }
        })(),
      ],
    });
  }
}
