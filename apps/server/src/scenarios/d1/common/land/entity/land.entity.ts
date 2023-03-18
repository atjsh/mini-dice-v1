import { UserIdType } from '@packages/shared-types';
import { UserEntity } from 'apps/server/src/user/entity/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class LandEntity {
  @PrimaryColumn({
    nullable: false,
  })
  id: number;

  @Column({
    nullable: false,
  })
  landName: string;

  @Column({
    type: 'char',
    length: '36',
    nullable: true,
    default: null,
  })
  userId: UserIdType | null;

  @ManyToOne(() => UserEntity, (user) => user.lands, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity | null;

  @Column({
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    type: 'timestamp',
  })
  expiresAt: Date | null;

  get isLandExpired(): boolean {
    if (this.expiresAt) {
      return this.expiresAt <= new Date();
    }
    return true;
  }
}
