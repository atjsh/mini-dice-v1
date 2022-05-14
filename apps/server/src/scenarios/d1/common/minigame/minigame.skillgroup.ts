import { getSkillRoutePath, SkillRouteType } from '@packages/scenario-routing';
import {
  MessageResponseFactory,
  PlainMessage,
  LinkGroup,
  Link,
  cashLocale,
  UserActivityMessage,
} from '@packages/shared-types';
import {
  drawDiceUserActivityMessage,
  MethodReturnType,
} from 'apps/server/src/skill-group-lib/skill-service-lib';
import {
  DiceUserActivitySkillDrawPropsType,
  InteractionUserActivitySkillDrawPropsType,
} from 'apps/server/src/skill-log/types/skill-draw-props.dto';
import { getStopImageUrl } from '../../../scenarios.commons';
import {
  calculateEarningFromMinigameScore,
  CommonMinigameService,
  getRevercedMinigameMove,
  MinigameMoveEnum,
  minigameMoveToKorean,
  MinigameResultEnum,
} from './minigame.service';

export function commonMinigameIndexDraw(
  props: DiceUserActivitySkillDrawPropsType<
    MethodReturnType<CommonMinigameService, 'commonIndex'>
  >,
  minigameName: string,
  maximumScore: number,
  submitSkillRoute: SkillRouteType,
) {
  return MessageResponseFactory({
    date: props.date,
    userRequestDrawings: drawDiceUserActivityMessage(props.userActivity),
    actionResultDrawings: [
      PlainMessage({
        thumbnail: {
          altName: '미니게임 칸 일러스트',
          imageUrl: getStopImageUrl(submitSkillRoute.skillGroupName),
        },
        title: minigameName,
        description: `${minigameName} 칸에 도착했습니다.`,
      }),
      LinkGroup({
        type: 'linkGroup',
        description: `동전 던지기의 결과를 예측하고, 연속해서 예측이 맞으면 돈을 받습니다. 최대 ${maximumScore}회 연속으로 예측할 수 있습니다.\n하지만 중간에 1회라도 실패하면 아무것도 받지 못합니다! \n당신의 예측은?`,
        links: [
          Link({
            displayText: '앞면이 나올 것이다',
            param: {
              signedMinigameHistory: props.skillServiceResult.minigameHistory,
              move: MinigameMoveEnum.HEAD,
            },
            skillRouteURL: getSkillRoutePath(submitSkillRoute),
          }),
          Link({
            displayText: '뒷면이 나올 것이다',
            param: {
              signedMinigameHistory: props.skillServiceResult.minigameHistory,
              move: MinigameMoveEnum.TAIL,
            },
            skillRouteURL: getSkillRoutePath(submitSkillRoute),
          }),
        ],
      }),
    ],
  });
}

export function commonMinigameSubmitDraw(
  props: InteractionUserActivitySkillDrawPropsType<
    MethodReturnType<CommonMinigameService, 'commonSubmit'>
  >,
  minigameName: string,
  maximumScore: number,
  startingEarningCash: number,
  submitSkillRoute: SkillRouteType,
) {
  return MessageResponseFactory({
    date: props.date,
    userRequestDrawings: [
      UserActivityMessage({
        title: minigameName,
        description:
          props.skillServiceResult.userMove === MinigameMoveEnum.STOP
            ? '예측을 포기했다'
            : `${minigameMoveToKorean(
                props.skillServiceResult.userMove,
              )}을 예측했다`,
        type: 'interactionUserActivityMessage',
      }),
    ],
    actionResultDrawings: [
      ...(() => {
        if (props.skillServiceResult.gameResult === MinigameResultEnum.LOSE) {
          return [
            PlainMessage({
              title: '예측 실패',
              description: `예측과 다르게 ${minigameMoveToKorean(
                getRevercedMinigameMove(props.skillServiceResult.userMove),
              )}이 나왔습니다. 예측에 실패했기 때문에 아무것도 받지 못했습니다...`,
            }),
          ];
        } else {
          if (props.skillServiceResult.userMove == MinigameMoveEnum.STOP) {
            return [
              PlainMessage({
                title: '예측을 멈췄습니다',
                description: `예측을 멈췄습니다! 총 ${
                  props.skillServiceResult.score
                }회 예측에 성공했습니다.\n${cashLocale(
                  props.skillServiceResult.earningCash,
                )} 받았습니다.`,
              }),
            ];
          } else if (props.skillServiceResult.canPlayMore == false) {
            return [
              PlainMessage({
                title: '예측 성공!',
                description: `예측 성공했습니다! 최대 예측 횟수인 ${maximumScore}회나 예측에 성공했기 때문에 ${minigameName}을 종료합니다.\n${cashLocale(
                  props.skillServiceResult.earningCash,
                )} 받았습니다.`,
              }),
            ];
          } else {
            return [
              PlainMessage({
                title: '예측 성공!',
                description: `예측 성공했습니다! 지금까지 총 ${props.skillServiceResult.score}회 맞췄습니다.`,
              }),
              LinkGroup({
                type: 'linkGroup',
                description: `예측을 포기하거나 계속할 수 있습니다. \n예측을 멈추면 ${cashLocale(
                  props.skillServiceResult.earningCash,
                )} 받을 수 있지만, 다시 한 번 예측에 성공하면 ${cashLocale(
                  calculateEarningFromMinigameScore(
                    props.skillServiceResult.score + 1,
                    startingEarningCash,
                  ),
                )} 받을 수 있습니다. \당신의 예측은?`,
                links: [
                  Link({
                    displayText: '앞면이 나올 것이다',
                    param: {
                      signedMinigameHistory:
                        props.skillServiceResult.signedMinigameHistory!,
                      move: MinigameMoveEnum.HEAD,
                    },
                    skillRouteURL: getSkillRoutePath(submitSkillRoute),
                  }),
                  Link({
                    displayText: '뒷면이 나올 것이다',
                    param: {
                      signedMinigameHistory:
                        props.skillServiceResult.signedMinigameHistory!,
                      move: MinigameMoveEnum.TAIL,
                    },
                    skillRouteURL: getSkillRoutePath(submitSkillRoute),
                  }),
                  Link({
                    displayText: '포기',
                    param: {
                      signedMinigameHistory:
                        props.skillServiceResult.signedMinigameHistory!,
                      move: MinigameMoveEnum.STOP,
                    },
                    skillRouteURL: getSkillRoutePath(submitSkillRoute),
                  }),
                ],
              }),
            ];
          }
        }
      })(),
    ],
  });
}
