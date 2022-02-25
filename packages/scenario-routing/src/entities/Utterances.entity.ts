import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BlockEntity } from './Blocks.entity';

@Index('FK__blocks', ['linkedBlockId'], {})
@Index('utterance', ['utterance'], { unique: true })
@Entity('utterances', { schema: 'common_scenarios_A' })
export class UtteranceEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('datetime', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('datetime', {
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column('varchar', { name: 'utterance', unique: true, length: 100 })
  utterance: string;

  @Column('int', { name: 'linked_block_id' })
  linkedBlockId: number;

  @ManyToOne(() => BlockEntity, (blocks) => blocks.utterances, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'linked_block_id', referencedColumnName: 'id' }])
  linkedBlock: BlockEntity;
}
