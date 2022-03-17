import { getSequentialPk } from '@apps/server/common';
import { ApiProperty } from '@nestjs/swagger';
import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';

const ProfileEntityTableName = 'tb_profile';

@Entity(ProfileEntityTableName)
export class ProfileEntity {
  /**
   * PK값
   */
  @ApiProperty({ readOnly: true })
  @PrimaryColumn({
    length: 20,
  })
  id: string;

  @BeforeInsert()
  setPk() {
    this.id = getSequentialPk(ProfileEntityTableName);
  }

  @Column()
  username: string;
}
