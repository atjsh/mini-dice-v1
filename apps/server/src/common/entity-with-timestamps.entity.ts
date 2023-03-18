import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class EntityWithTimestamps {
  /** 객체가 생성된 날짜 */
  @CreateDateColumn({ type: 'timestamp', comment: '객체가 생성된 날짜' })
  createdAt: Date;

  /** 객체가 업데이트된 날짜 */
  @UpdateDateColumn({ type: 'timestamp', comment: '객체가 업데이트된 날짜' })
  updatedAt: Date;
}
