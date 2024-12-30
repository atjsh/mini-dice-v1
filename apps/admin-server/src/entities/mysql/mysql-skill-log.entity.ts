import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'skill_log_entity',
})
export class MySQLSkillLogEntity {
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
    name: 'skillRoute',
    type: 'varchar',
    length: 255,
  })
  skillRoute: string;

  @Column({
    name: 'userActivity',
    type: 'json',
    nullable: true,
  })
  userActivity: string;

  @Column({
    name: 'skillServiceResult',
    type: 'json',
    nullable: true,
  })
  skillServiceResult: string;

  @Column({
    name: 'date',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  date: Date;
}
