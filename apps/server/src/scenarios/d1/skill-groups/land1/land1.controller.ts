import { Body } from '@nestjs/common';
import { getSkillRoutePath, SkillGroup } from '@packages/scenario-routing';
import {
  PlainMessage,
  FormMessage,
  DataField,
  InputField,
  MessageResponseFactory,
  UserActivityMessage,
} from '@packages/shared-types';
import { UserJwtDto } from 'apps/server/src/auth/local-jwt/access-token/dto/user-jwt.dto';
import { UserJwt } from 'apps/server/src/profile/decorators/user.decorator';
import { SkillGroupController } from 'apps/server/src/skill-group-lib/skill-group-controller-factory';
import {
  DiceUserActivitySkillDrawPropsType,
  InteractionUserActivitySkillDrawPropsType,
} from 'apps/server/src/skill-log/types/skill-draw-props.dto';
import { InteractionUserActivity } from 'apps/server/src/skill-log/types/user-activity.dto';
import {
  SkillGroupAlias,
  WebIndexSkillDraw,
  MethodReturnType,
  WebSkill,
  WebSkillDraw,
} from 'apps/server/src/skill-service-lib/skill-service-lib';
import {
  LandStatus,
  LandBuyableByUserEnum,
  LandBuyingResult,
} from '../../common/land/land.service';
import { DogdripScenarioRoutes } from '../../routes';
import { Land1Service } from './land1.service';

class LandButmitParamType {
  landName: string;
}

@SkillGroup(DogdripScenarioRoutes.skillGroups.land1)
export class Land1Controller extends SkillGroupController<Land1Service> {
  constructor(land1Service: Land1Service) {
    super(land1Service);
  }

  @SkillGroupAlias()
  async getSkillGroupAlias() {
    const landStatus = await this.skillService.getCurrentLandStatus();
    return `${landStatus.landOwnedBy?.username || '운영자'}의 ${
      landStatus.landName
    } 토지`;
  }

  landBuyableByUserMessage(landStatus: LandStatus) {
    return [
      PlainMessage({
        description: `지금 이 토지를 구매할 수 있습니다! 다른 유저가 구매하기 전에 서두르세요.`,
      }),
      FormMessage({
        description: '토지 구입',
        dataFields: [
          DataField({
            label: '토지 가격',
            value: `${landStatus.landPrice}원`,
            inline: false,
          }),
          DataField({
            label: '통행비',
            value: `${landStatus.tollFee}원`,
            inline: true,
          }),
          DataField({
            label: '토지 소유 가능 시간',
            value: `${landStatus.landTTLsecs}초`,
            inline: true,
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
        submitSkillRouteURL: getSkillRoutePath(
          DogdripScenarioRoutes.skillGroups.land1.skills.submit,
        ),
      }),
    ];
  }

  landNotBuyableBCUserAlreadyOwns() {
    return [
      PlainMessage({
        description:
          '이 토지는 이미 당신의 토지입니다! 다른 유저가 이 토지를 구매하기 전까지 당신의 토지로써 통행료를 걷을 수 있습니다.',
      }),
    ];
  }

  landNotBuyableBCOtherUserAlreadyOwns(landStatus: LandStatus) {
    return [
      PlainMessage({
        description: `아직 ${
          landStatus.landOwnedBy?.username
        }가 이 토지를 소유하고 있습니다. \n 이 토지는 ${
          landStatus.landExpiresAt
            ? new Date(landStatus.landExpiresAt).toLocaleString('ko-KR')
            : '나중'
        }에 구매할 수 있게 됩니다. 다시 이 칸에 들러 주세요!`,
      }),
    ];
  }

  landNotBuyableBCNotEnoughMoneey(landStatus: LandStatus) {
    return [
      PlainMessage({
        description: `앗! 이 토지를 구매하려면 ${landStatus.landPrice}원이 필요합니다만, 돈이 부족하기에 토지를 구매할 수 없습니다. \n돈을 벌고 다시 들러 주세요!`,
      }),
    ];
  }

  @WebIndexSkillDraw()
  async webIndexDraw(
    @Body()
    props: DiceUserActivitySkillDrawPropsType<
      MethodReturnType<Land1Service, 'index'>
    >,
  ) {
    return MessageResponseFactory({
      date: props.date,
      userRequestDrawings: this.drawDiceUserActivityMessage(props.userActivity),
      actionResultDrawings: [
        PlainMessage({
          title: '토지 칸',
          description: `${props.skillServiceResult.landStatus.landName} 토지 칸에 도착했습니다.`,
        }),
        ...(props.skillServiceResult.landBuyableByUserStatus.status ==
        LandBuyableByUserEnum.BUYABLE
          ? this.landBuyableByUserMessage(props.skillServiceResult.landStatus)
          : props.skillServiceResult.landBuyableByUserStatus.status ==
            LandBuyableByUserEnum.ALREADY_OWNED_BY_OTHER
          ? this.landNotBuyableBCOtherUserAlreadyOwns(
              props.skillServiceResult.landStatus,
            )
          : props.skillServiceResult.landBuyableByUserStatus.status ==
            LandBuyableByUserEnum.NOT_ENOUGH_MONEY
          ? this.landNotBuyableBCNotEnoughMoneey(
              props.skillServiceResult.landStatus,
            )
          : props.skillServiceResult.landBuyableByUserStatus.status ==
            LandBuyableByUserEnum.ALREADY_OWNED_BY_YOU
          ? this.landNotBuyableBCUserAlreadyOwns()
          : []),
      ],
    });
  }

  @WebSkill(DogdripScenarioRoutes.skillGroups.land1.skills.submit)
  async submit(
    @Body() props: InteractionUserActivity<LandButmitParamType>,
    @UserJwt() { userId }: UserJwtDto,
  ) {
    return this.skillService.submit({
      userId,
      landName: props.params.landName,
    });
  }

  @WebSkillDraw(DogdripScenarioRoutes.skillGroups.land1.skills.submit)
  async webSubmitDraw(
    @Body()
    props: InteractionUserActivitySkillDrawPropsType<
      MethodReturnType<Land1Service, 'submit'>
    >,
  ) {
    return MessageResponseFactory({
      date: props.date,
      userRequestDrawings: UserActivityMessage({
        type: 'interactionUserActivityMessage',
        title: '토지 구입',
      }),
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
}
