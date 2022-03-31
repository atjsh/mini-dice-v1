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
import { BookEventEnum, BookService } from './book.service';

@SkillGroup(D1ScenarioRoutes.skillGroups.book)
export class BookSkillGroup implements SkillGroupController {
  constructor(private skillService: BookService) {}

  getSkillGroupAlias(): string | Promise<string> {
    return '책을 내다';
  }

  @Skill(D1ScenarioRoutes.skillGroups.book.skills.index)
  async index(indexSkillProps: IndexSkillPropsType) {
    return await this.skillService.index(indexSkillProps);
  }

  @SkillDraw(D1ScenarioRoutes.skillGroups.book.skills.index)
  async indexDraw(
    props: DiceUserActivitySkillDrawPropsType<
      MethodReturnType<BookService, 'index'>
    >,
  ) {
    return MessageResponseFactory({
      date: props.date,
      userRequestDrawings: drawDiceUserActivityMessage(props.userActivity),
      actionResultDrawings: [
        PlainMessage({
          title: `${this.getSkillGroupAlias()} 칸`,
          description: '책을 써서 출판합니다.',
        }),
        props.skillServiceResult.cashChangeEvent.eventCase.causeName ==
        BookEventEnum.MADE_PROFIT
          ? PlainMessage({
              title: '수익을 남겼습니다!',
              description: `'${
                props.skillServiceResult.book
              }' 책은 매우 잘 팔려서 ${cashLocale(
                props.skillServiceResult.cashChangeEvent.value,
              )} 벌었습니다.`,
            })
          : PlainMessage({
              title: '본전 쳤네요',
              description: `'${props.skillServiceResult.book}' 책은 몇몇 사람들이 좋아하는 작품이 되었습니다.`,
            }),
      ],
    });
  }
}
