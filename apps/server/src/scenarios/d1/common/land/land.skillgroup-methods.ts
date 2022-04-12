import { getSkillRoutePath, SkillRouteType } from '@packages/scenario-routing';
import {
  cashLocale,
  DataField,
  FormMessage,
  InputField,
  MessageResponseFactory,
  PlainMessage,
  strEllipsis,
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
import {
  CommonLandService,
  LandBuyableByUserEnum,
  LandBuyingResult,
  LandStatus,
} from './land.service';

export function getCommonLandSkillGroupAlias(
  landStatus: LandStatus,
  adjective?: string,
) {
  return `${
    landStatus.landOwnedBy?.username
      ? strEllipsis(landStatus.landOwnedBy?.username, 6)
      : '운영자'
  }의 ${landStatus.landName} ${adjective ? adjective : ''}토지`;
}

function secondsToBiggerTime(seconds: number) {
  if (seconds < 60) {
    return `${seconds}초`;
  }
  if (seconds < 60 * 60) {
    return `${Math.floor(seconds / 60)}분 ${seconds % 60}초`;
  }
  if (seconds < 60 * 60 * 60) {
    return `${Math.floor(seconds / 3600)}시간 ${Math.floor(
      (seconds % 3600) / 60,
    )}분`;
  }
  return `${Math.floor(seconds / 3600 / 24)}일 ${Math.floor(
    (seconds % 3600) / 60,
  )}분`;
}

function landBuyableByUserMessage(
  landStatus: LandStatus,
  submitSkillRoute: SkillRouteType,
) {
  return [
    PlainMessage({
      description: `지금 이 토지를 구매할 수 있습니다! 다른 유저가 구매하기 전에 서두르세요.`,
    }),
    FormMessage({
      description: '토지 구입',
      dataFields: [
        DataField({
          label: '토지 가격',
          value: String(landStatus.landPrice),
          inline: false,
          isCash: true,
        }),
        DataField({
          label: '통행비',
          value: String(landStatus.tollFee),
          inline: true,
          isCash: true,
        }),
        DataField({
          label: '토지 소유 가능 시간',
          value: `${secondsToBiggerTime(landStatus.landTTLsecs)}`,
          inline: true,
          isCash: false,
        }),
      ],
      inputFields: [
        InputField({
          name: 'landName',
          label: '토지 이름',
          type: 'string',
          placeholder: '토지 이름 정하기',
          minLength: 1,
          maxLength: 10,
        }),
      ],
      submitButtonLabel: '구매하기',
      submitSkillRouteURL: getSkillRoutePath(submitSkillRoute),
    }),
  ];
}

function landNotBuyableBCUserAlreadyOwns() {
  return [
    PlainMessage({
      description:
        '이 토지는 이미 당신의 토지입니다! 다른 유저가 이 토지를 구매하기 전까지 당신의 토지로써 통행료를 걷을 수 있습니다.',
    }),
  ];
}

function landNotBuyableBCOtherUserAlreadyOwns(
  landStatus: LandStatus,
  timezone: string,
) {
  return [
    PlainMessage({
      description: `아직 '${
        landStatus.landOwnedBy?.username
      }' 유저가 이 토지를 소유하고 있습니다. \n 이 토지는 ${
        landStatus.landExpiresAt
          ? new Date(landStatus.landExpiresAt).toLocaleString('ko-KR', {
              timeZone: timezone,
            })
          : '나중'
      }에 구매할 수 있게 됩니다. 다시 이 칸에 들러 주세요!`,
    }),
  ];
}

function landNotBuyableBCNotEnoughMoneey(landStatus: LandStatus) {
  return [
    PlainMessage({
      description: `앗! 이 토지를 구매하려면 ${cashLocale(
        landStatus.landPrice,
      )} 필요하지만, 돈이 부족하기에 토지를 구매할 수 없습니다. \n돈을 벌고 다시 들러 주세요!`,
    }),
  ];
}

export function commonLandSkillGroupWebIndexDraw(
  props: DiceUserActivitySkillDrawPropsType<
    MethodReturnType<CommonLandService, 'indexSkill'>
  >,
  submitSkillRoute: SkillRouteType,
) {
  return MessageResponseFactory({
    date: props.date,
    userRequestDrawings: drawDiceUserActivityMessage(props.userActivity),
    actionResultDrawings: [
      PlainMessage({
        title: '토지 칸',
        description: `${
          props.skillServiceResult.landStatus.landName
        } 토지 칸에 도착했습니다. ${
          props.skillServiceResult.landBuyableByUserStatus.status ==
            LandBuyableByUserEnum.ALREADY_OWNED_BY_YOU ||
          props.skillServiceResult.landStatus.landOwnedBy == null
            ? ''
            : `\n${
                props.skillServiceResult.landStatus.landOwnedBy?.username
              } 유저에게 ${BigInt(
                props.skillServiceResult.landStatus.tollFee,
              ).toLocaleString('ko-kr', {
                style: 'currency',
                currency: 'KRW',
              })} 통행료를 지불했습니다.`
        }`,
      }),
      ...(props.skillServiceResult.landBuyableByUserStatus.status ==
      LandBuyableByUserEnum.BUYABLE
        ? landBuyableByUserMessage(
            props.skillServiceResult.landStatus,
            submitSkillRoute,
          )
        : props.skillServiceResult.landBuyableByUserStatus.status ==
          LandBuyableByUserEnum.ALREADY_OWNED_BY_OTHER
        ? landNotBuyableBCOtherUserAlreadyOwns(
            props.skillServiceResult.landStatus,
            props.timezone,
          )
        : props.skillServiceResult.landBuyableByUserStatus.status ==
          LandBuyableByUserEnum.NOT_ENOUGH_MONEY
        ? landNotBuyableBCNotEnoughMoneey(props.skillServiceResult.landStatus)
        : props.skillServiceResult.landBuyableByUserStatus.status ==
          LandBuyableByUserEnum.ALREADY_OWNED_BY_YOU
        ? landNotBuyableBCUserAlreadyOwns()
        : []),
    ],
  });
}

export function commonLandSkillGroupWebSubmitDraw(
  props: InteractionUserActivitySkillDrawPropsType<
    MethodReturnType<CommonLandService, 'submitSkill'>
  >,
) {
  return MessageResponseFactory({
    date: props.date,
    userRequestDrawings: [
      UserActivityMessage({
        type: 'interactionUserActivityMessage',
        title: '토지 구입',
      }),
    ],
    actionResultDrawings: [
      props.skillServiceResult.buyingResult == LandBuyingResult.SUCCESS
        ? PlainMessage({
            description: `'${props.skillServiceResult.landName}' 토지 구매에 성공했습니다.`,
          })
        : PlainMessage({
            description: `앗! 토지 구매에 실패했습니다. 아무래도 다른 사용자가 더 빠르게 이 토지를 구매한 것 같습니다.`,
          }),
    ],
  });
}
