import {
  cashLocale,
  MessageResponseFactory,
  PlainMessage,
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
import { DiceUserActivitySkillDrawPropsType } from 'apps/server/src/skill-log/types/skill-draw-props.dto';
import { D1ScenarioRoutes } from '../../routes';
import {
  MoneyCollection1ResultEnum,
  MoneyCollection1Service,
} from './money-collection-1.service';

@SkillGroup(D1ScenarioRoutes.skillGroups.moneyCollection1)
export class MoneyCollection1SkillGroup implements SkillGroupController {
  constructor(private skillService: MoneyCollection1Service) {}

  getSkillGroupAlias(): string | Promise<string> {
    return '모임통장';
  }

  @Skill(D1ScenarioRoutes.skillGroups.moneyCollection1.skills.index)
  async index(indexSkillProps: IndexSkillPropsType) {
    return await this.skillService.index(indexSkillProps);
  }

  @SkillDraw(D1ScenarioRoutes.skillGroups.moneyCollection1.skills.index)
  async indexDraw(
    props: DiceUserActivitySkillDrawPropsType<
      MethodReturnType<MoneyCollection1Service, 'index'>
    >,
  ) {
    return MessageResponseFactory({
      userRequestDrawings: drawDiceUserActivityMessage(props.userActivity),
      date: props.date,
      actionResultDrawings: [
        PlainMessage({
          title: '모임통장 칸',
          description: `친구들과 함께 통장을 관리합니다. \n칸에 도착할 때마다 모임통장에 ${cashLocale(
            1000,
          )} 입금하고, 모임통장에 돈이 ${cashLocale(
            1000 * 10,
          )} 모였을 때 이 칸에 도착하면 돈을 인출해갈 수 있습니다.`,
        }),
        ...(() => {
          switch (props.skillServiceResult.result) {
            case MoneyCollection1ResultEnum.PAYED:
              return [
                PlainMessage({
                  title: '모임통장 입금 내역은 다음과 같습니다',
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
                  description: `모임통장에 총 ${cashLocale(
                    (props.skillServiceResult.usernamesLength ?? 1) * 1000,
                  )} 모여있는 상태입니다. ${cashLocale(
                    props.skillServiceResult.payedCash,
                  )} 입금했습니다.`,
                }),
              ];
            case MoneyCollection1ResultEnum.RECIEVED:
              return [
                PlainMessage({
                  title: '모임통장 입금 내역은 다음과 같습니다',
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
                  description: `현재 모임통장에 총 ${cashLocale(
                    (props.skillServiceResult.usernamesLength ?? 1) * 1000,
                  )} 모여 있습니다. 당신은 통장에서 돈을 인출해갈 수 있습니다!\n${cashLocale(
                    props.skillServiceResult.earnedCash,
                  )} 가져갔습니다.`,
                }),
              ];
            case MoneyCollection1ResultEnum.SKIPPED:
              return [
                PlainMessage({
                  title: '스킵되었어요',
                  description: `당신이 보유중인 돈이 부족하기 때문에 아무것도 하지 않았습니다. 현재 ${cashLocale(
                    props.skillServiceResult.usernamesLength ?? 1 * 1000,
                  )} 모여 있습니다.`,
                }),
              ];
          }
        })(),
      ],
    });
  }
}
