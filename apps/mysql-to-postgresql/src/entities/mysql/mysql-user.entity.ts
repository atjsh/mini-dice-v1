import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'tb_user',
})
export class MySQLUserEntity {
  @PrimaryColumn({
    name: 'userId',
    type: 'varchar',
    length: 20,
  })
  id: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  email: string | null;

  @Column({
    name: 'authProvider',
    type: 'varchar',
    length: 10,
    nullable: false,
  })
  authProvider: string;

  @Column({
    name: 'username',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  username: string;

  @Column({
    name: 'cash',
    type: 'bigint',
    nullable: false,
  })
  cash: string;

  @Column({
    name: 'isUserDiceTossForbidden',
    type: 'boolean',
    nullable: false,
  })
  isUserDiceTossForbidden: boolean;

  @Column({
    name: 'canTossDiceAfter',
    type: 'timestamp',
    nullable: true,
  })
  canTossDiceAfter: Date | null;

  @Column({
    name: 'countryCode3',
    type: 'varchar',
    length: 3,
    nullable: false,
  })
  countryCode3: string;

  @Column({
    name: 'signupCompleted',
    type: 'boolean',
    nullable: false,
  })
  signupCompleted: boolean;

  @Column({
    name: 'isTerminated',
    type: 'boolean',
    nullable: false,
  })
  isTerminated: boolean;

  @Column({
    name: 'stockId',
    type: 'int',
    nullable: true,
  })
  stockId: number | null;

  @Column({
    name: 'stockPrice',
    type: 'bigint',
    nullable: false,
  })
  stockPrice: bigint;

  @Column({
    name: 'stockAmount',
    type: 'bigint',
    nullable: false,
  })
  stockAmount: bigint;

  @Column({
    name: 'submitAllowedMapStop',
    type: 'varchar',
    length: 80,
    nullable: true,
  })
  submitAllowedMapStop: string | null;

  @Column({
    name: 'stockCashPurchaseSum',
    type: 'bigint',
    nullable: true,
  })
  stockCashPurchaseSum: bigint | null;

  @Column({
    name: 'canAddLandComment',
    type: 'boolean',
    nullable: false,
  })
  canAddLandComment: boolean;

  @Column({
    name: 'createdAt',
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @Column({
    name: 'updatedAt',
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}
