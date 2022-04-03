import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SkillRouteType } from '@packages/scenario-routing';
import { UserIdType } from '@packages/shared-types';
import { SkillServiceProps } from 'apps/server/src/skill-group-lib/skill-service-lib';
import {
  UserEntity,
  UserCashStrType,
} from 'apps/server/src/user/entity/user.entity';
import { UserRepository } from 'apps/server/src/user/user.repository';
import { Repository } from 'typeorm';
import { getUserCanTossDice } from '../../../scenarios.commons';
import { SCENARIO_NAMES } from '../../../scenarios.constants';
import { LandEntity } from './entity/land.entity';

export enum LandIdEnum {
  LAND1 = 1,
  LAND2 = 2,
  LAND3 = 3,
  LAND4 = 4,
  LAND5 = 5,
  LAND6 = 6,
}

export enum LandBuyableByUserEnum {
  BUYABLE,
  ALREADY_OWNED_BY_YOU,
  ALREADY_OWNED_BY_OTHER,
  NOT_ENOUGH_MONEY,
}

export type LandBuyableByUserStatus = {
  status: LandBuyableByUserEnum;
};

interface LandInitalData {
  id: LandIdEnum;
  landName: string;
  tollFee: number;
  landPrice: number;
  landTTLsecs: number;
}

// 토지의 상태
export class LandStatus {
  id: LandIdEnum;
  landName: LandInitalData['landName'];
  tollFee: LandInitalData['tollFee'];
  landPrice: LandInitalData['landPrice'];
  landTTLsecs: LandInitalData['landTTLsecs'];
  landOwnedBy: UserEntity | null;
  landExpiresAt: LandEntity['expiresAt'];
  isLandExpired: LandEntity['isLandExpired'];
}

export const landInitalDataList = [
  {
    id: LandIdEnum.LAND1,
    landName: '빈',
    tollFee: 2000,
    landPrice: 5000,
    landTTLsecs: 60 * 5,
  },
  {
    id: LandIdEnum.LAND2,
    landName: '빈',
    tollFee: 10000,
    landPrice: 7000,
    landTTLsecs: 60 * 30,
  },
  {
    id: LandIdEnum.LAND3,
    landName: '빈',
    tollFee: 20000,
    landPrice: 20000,
    landTTLsecs: 60 * 60,
  },
  {
    id: LandIdEnum.LAND4,
    landName: '빈',
    tollFee: 5000,
    landPrice: 4000,
    landTTLsecs: 60 * 75,
  },
  {
    id: LandIdEnum.LAND5,
    landName: '빈',
    tollFee: 1000,
    landPrice: 1000,
    landTTLsecs: 60 * 3,
  },
  {
    id: LandIdEnum.LAND6,
    landName: '빈',
    tollFee: 10000,
    landPrice: 8000,
    landTTLsecs: 60 * 10,
  },
] as const;

export class LandNotForSaleYet extends HttpException {
  constructor(prop: {
    landId: LandEntity['id'];
    buyableAt: LandEntity['expiresAt'];
  }) {
    super(
      {
        status: 403,
        message: `Land is not buyable yet; ${prop}`,
      },
      403,
    );
  }
}

export class LandAlreadyBought extends HttpException {
  constructor(prop: { landId: LandEntity['id']; userId: UserEntity['id'] }) {
    super(
      {
        status: 403,
        message: `Land already bought; ${JSON.stringify(prop)}`,
      },
      403,
    );
  }
}

export class LandTooExpensive extends HttpException {
  constructor(prop: {
    landId: LandEntity['id'];
    userId: UserEntity['id'];
    landPrice: LandInitalData['landPrice'];
    userCashStr: UserCashStrType;
  }) {
    super(
      {
        status: 403,
        message: `Land is too expensive for user; ${JSON.stringify(prop)}`,
      },
      403,
    );
  }
}

export enum LandBuyingResult {
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
}

@Injectable()
export class CommonLandService {
  constructor(
    private userRepository: UserRepository,

    @InjectRepository(LandEntity)
    private landRepository: Repository<LandEntity>,
  ) {}

  private async initLand(id: LandEntity['id']): Promise<LandEntity> {
    const initalLand = landInitalDataList.find((land) => land.id == id);
    if (!initalLand) {
      throw new Error(`Land with id ${id} not found`);
    }
    return this.landRepository.save({
      id: initalLand.id,
      landName: initalLand.landName,
    });
  }

  private async getLand(id: LandEntity['id']): Promise<LandEntity | undefined> {
    return this.landRepository.findOne(id);
  }

  private async getLandOrCreate(id: LandEntity['id']): Promise<LandEntity> {
    const foundLand = await this.getLand(id);
    if (foundLand) {
      return foundLand;
    }
    return await this.initLand(id);
  }

  private async getLandStatusByLandEntity(
    landEntity: LandEntity,
  ): Promise<LandStatus> {
    const LandInitalData = landInitalDataList.find(
      (land) => land.id == landEntity.id,
    )!;

    return {
      id: landEntity.id,
      landName: landEntity.landName,
      landOwnedBy: landEntity.user,
      landExpiresAt: landEntity.expiresAt,
      landPrice: LandInitalData.landPrice,
      landTTLsecs: LandInitalData.landTTLsecs,
      tollFee: LandInitalData.tollFee,
      isLandExpired: landEntity.isLandExpired,
    };
  }

  public async isLandBuyableByUser(
    landStatus: LandStatus,
    userId: UserIdType,
  ): Promise<LandBuyableByUserStatus> {
    const user = await this.userRepository.findOneOrFail(userId);
    if (landStatus.landOwnedBy?.id == userId) {
      return {
        status: LandBuyableByUserEnum.ALREADY_OWNED_BY_YOU,
      };
    } else if (landStatus.isLandExpired == true) {
      if (landStatus.landPrice * 2 < user.cash) {
        return {
          status: LandBuyableByUserEnum.NOT_ENOUGH_MONEY,
        };
      } else {
        return {
          status: LandBuyableByUserEnum.BUYABLE,
        };
      }
    } else {
      return {
        status: LandBuyableByUserEnum.ALREADY_OWNED_BY_OTHER,
      };
    }
  }

  public async getLandStatusById(id: LandIdEnum): Promise<LandStatus> {
    const landEntity = await this.getLandOrCreate(id);
    return await this.getLandStatusByLandEntity(landEntity);
  }

  // 토지를 구매한다.
  public async buyLand(
    landId: LandIdEnum,
    userId: UserEntity['id'],
    landName: LandEntity['landName'],
  ) {
    const land = await this.getLandOrCreate(landId);

    if (land.userId == userId) {
      throw new LandAlreadyBought({ landId, userId });
    }

    if (land.isLandExpired == false) {
      throw new LandNotForSaleYet({ landId, buyableAt: land.expiresAt });
    }

    const initalLandData = landInitalDataList.find(
      (land) => land.id == landId,
    )!;

    const user = await this.userRepository.findOneOrFail(userId);

    if (user.cash < initalLandData.landPrice) {
      throw new LandTooExpensive({
        landId,
        userId,
        landPrice: initalLandData.landPrice,
        userCashStr: user.cash.toString(),
      });
    }

    const buyableAt = new Date(
      new Date().getTime() + initalLandData.landTTLsecs * 1000,
    );

    const saveObject: Omit<LandEntity, 'isLandExpired' | 'user'> = {
      id: landId,
      userId,
      expiresAt: buyableAt,
      landName,
    };

    await this.landRepository.save(saveObject);

    await this.userRepository.changeUserCash(
      userId,
      -initalLandData.landPrice,
      user.cash,
    );

    return {
      landName,
    };
  }

  public async indexSkill(
    props: SkillServiceProps<{
      landId: LandIdEnum;
      landSubmitSkillRoute: SkillRouteType;
    }>,
  ) {
    const landStatus = await this.getLandStatusById(props.landId);
    const landBuyableByUserStatus = await this.isLandBuyableByUser(
      landStatus,
      props.userId,
    );
    // 통행세 걷기
    if (
      [LandBuyableByUserEnum.ALREADY_OWNED_BY_YOU].includes(
        landBuyableByUserStatus.status,
      ) == false &&
      landStatus.landOwnedBy != null
    ) {
      await Promise.all([
        this.userRepository.changeUserCash(props.userId, -landStatus.tollFee),
        this.userRepository.changeUserCash(
          landStatus.landOwnedBy!.id,
          landStatus.tollFee,
        ),
      ]);
    }
    if (landBuyableByUserStatus.status == LandBuyableByUserEnum.BUYABLE) {
      await this.userRepository.setUserAllowedSkillRoute(
        props.userId,
        props.landSubmitSkillRoute,
        false,
      );
    }

    await this.userRepository.setUserCanTossDice(
      props.userId,
      getUserCanTossDice(SCENARIO_NAMES.D1),
      false,
    );

    return {
      landStatus,
      landBuyableByUserStatus,
    };
  }

  public async submitSkill(
    props: SkillServiceProps<{ landName: string; landId: LandIdEnum }>,
  ) {
    try {
      await this.buyLand(props.landId, props.userId, props.landName);
      return {
        landName: props.landName,
        buyingResult: LandBuyingResult.SUCCESS,
      };
    } catch (error) {
      return {
        landName: props.landName,
        buyingResult: LandBuyingResult.FAIL,
      };
    }
  }
}

export class CommonLandServiceSubmitParamType {
  landName: string;
}
