import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BlockEntity } from './Blocks.entity';
import { QuickReplieEntity } from './QuickReplies.entity';

@Index('FK_block_and_quick_reply_links_blocks', ['blockId'], {})
@Index('FK_block_and_quick_reply_links_quick_replies', ['quickReplyId'], {})
@Index('fk_block_and_quick_reply_links_scenarios1_idx', ['scenarioId'], {})
@Entity('block_and_quick_reply_links', { schema: 'common_scenarios_A' })
export class BlockAndQuickReplyLinkEntity {
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

  @Column('int', { name: 'scenario_id', nullable: true })
  scenarioId: number | null;

  @Column('int', { name: 'block_id', nullable: true })
  blockId: number | null;

  @Column('int', { name: 'quick_reply_id', nullable: true })
  quickReplyId: number | null;

  @Column('varchar', { name: 'name', nullable: true, length: 50 })
  name: string | null;

  @Column('int', { name: 'depth', nullable: true })
  depth: number | null;

  @Column('varchar', {
    name: 'condition_1',
    nullable: true,
    length: 50,
    default: () => "'-'",
  })
  condition_1: string | null;

  @Column('varchar', {
    name: 'condition_2',
    nullable: true,
    length: 50,
    default: () => "'-'",
  })
  condition_2: string | null;

  @Column('varchar', {
    name: 'condition_3',
    nullable: true,
    length: 50,
    default: () => "'-'",
  })
  condition_3: string | null;

  @ManyToOne(() => BlockEntity, (blocks) => blocks.blockAndQuickReplyLinks, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'block_id', referencedColumnName: 'id' }])
  block: BlockEntity;

  @ManyToOne(
    () => QuickReplieEntity,
    (quickReplies) => quickReplies.blockAndQuickReplyLinks,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' },
  )
  @JoinColumn([{ name: 'quick_reply_id', referencedColumnName: 'id' }])
  quickReply: QuickReplieEntity;
}
