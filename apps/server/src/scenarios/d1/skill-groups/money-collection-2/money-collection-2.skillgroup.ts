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
import type { MoneyCollection2Service } from './money-collection-2.service';
import { MoneyCollection2ResultEnum } from './money-collection-2.service';

@SkillGroup(D1ScenarioRoutes.skillGroups.moneyCollection2)
export class MoneyCollection2SkillGroup implements SkillGroupController {
  constructor(private skillService: MoneyCollection2Service) {}

  getSkillGroupAlias(): string | Promise<string> {
    return '기부';
  }

  @Skill(D1ScenarioRoutes.skillGroups.moneyCollection2.skills.index)
  async index(indexSkillProps: IndexSkillPropsType) {
    return await this.skillService.index(indexSkillProps);
  }

  @SkillDraw(D1ScenarioRoutes.skillGroups.moneyCollection2.skills.index)
  async indexDraw(
    props: DiceUserActivitySkillDrawPropsType<
      MethodReturnType<MoneyCollection2Service, 'index'>
    >,
  ) {
    return MessageResponseFactory({
      userRequestDrawings: drawDiceUserActivityMessage(props.userActivity),
      date: props.date,
      actionResultDrawings: [
        PlainMessage({
          title: '기부 칸',
          description: `돈이 부족한 사람을 위해 기부금을 모읍니다. \n가진 돈이 ${cashLocale(
            3000,
          )} 이상이면 기부금을 내야 합니다. 가진 돈이 ${cashLocale(
            1000,
          )} 미만이면 그동안 모인 기부금을 받게 됩니다.`,
        }),
        ...(() => {
          switch (props.skillServiceResult.result) {
            case MoneyCollection2ResultEnum.SKIPPED:
              return [
                PlainMessage({
                  title: '스킵했습니다',
                  description:
                    '가진 돈이 3000원 미만 1000원 이상이기 때문에 기부금을 내지 않고 스킵했습니다.',
                }),
              ];

            case MoneyCollection2ResultEnum.NO_GIVER:
              return [
                PlainMessage({
                  title: '아쉽게도 기부자가 한 명도 없네요',
                  description:
                    '당신은 기부를 받아야 합니다. 하지만 기부자가 한 명도 없네요... \n다음에 다시 이 칸에 들러 주세요!',
                }),
              ];

            case MoneyCollection2ResultEnum.PAYED:
              return [
                PlainMessage({
                  title: '기부금 입금 내역은 다음과 같습니다',
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
                  title: '기부금을 냈습니다',
                  description: `기부금을 ${cashLocale(
                    props.skillServiceResult.payed,
                  )} 냈습니다. 모인 기부금은 총 ${cashLocale(
                    props.skillServiceResult.collected,
                  )} 입니다`,
                }),
              ];

            case MoneyCollection2ResultEnum.RECIEVED:
              return [
                PlainMessage({
                  title: '기부금 입금 내역은 다음과 같습니다',
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
                  title: '기부금을 받았습니다',
                  description: `기부금이 총 ${cashLocale(
                    props.skillServiceResult.collected,
                  )} 모여 있습니다. 당신은 기부금을 받을 수 있습니다!\n${cashLocale(
                    props.skillServiceResult.collected,
                  )} 받았습니다.`,
                }),
              ];
          }
        })(),
      ],
    });
  }
}
