import { ApiProperty } from '@nestjs/swagger';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class EntityWithTimestamps {
  /** 객체가 생성된 날짜 */
  @ApiProperty({ readOnly: true })
  @CreateDateColumn({ type: 'timestamp', comment: '객체가 생성된 날짜' })
  createdAt: Date;

  /** 객체가 업데이트된 날짜 */
  @ApiProperty({ readOnly: true })
  @UpdateDateColumn({ type: 'timestamp', comment: '객체가 업데이트된 날짜' })
  updatedAt: Date;
}
