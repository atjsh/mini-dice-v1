import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'user_land_comment_entity',
})
export class MySQLUserLandCommentEntity {
  @PrimaryColumn({
    name: 'id',
    type: 'varchar',
    length: 36,
  })
  id: string;

  @Column({
    name: 'userId',
    type: 'varchar',
    length: 36,
  })
  userId: string;

  @Column({
    name: 'landId',
    type: 'varchar',
    length: 255,
  })
  landId: string;

  @Column({
    name: 'comment',
    type: 'varchar',
    length: 200,
  })
  comment: string;

  @Column({
    name: 'date',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  date: Date;
}
