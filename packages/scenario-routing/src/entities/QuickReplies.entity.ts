import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BlockAndQuickReplyLinkEntity } from './BlockAndQuickReplyLinks.entity';
import { BlockEntity } from './Blocks.entity';

@Index('code', ['code'], { unique: true })
@Index('FK_quick_replies_blocks', ['linkedBlockId'], {})
@Entity('quick_replies', { schema: 'common_scenarios_A' })
export class QuickReplieEntity {
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

  @Column('varchar', { name: 'name', length: 100 })
  name: string;

  @Column('varchar', { name: 'type', length: 100 })
  type: string;

  @Column('varchar', { name: 'label', length: 100 })
  label: string;

  @Column('varchar', { name: 'message', length: 100 })
  message: string;

  @Column('varchar', { name: 'code', unique: true, length: 100 })
  code: string;

  @Column('text', { name: 'url' })
  url: string;

  @Column('int', { name: 'linked_block_id', nullable: true })
  linkedBlockId: number | null;

  @Column('varchar', { name: 'link_type', nullable: true, length: 50 })
  linkType: string | null;

  @Column('varchar', { name: 'make_type', nullable: true, length: 50 })
  makeType: string | null;

  @OneToMany(
    () => BlockAndQuickReplyLinkEntity,
    (blockAndQuickReplyLinks) => blockAndQuickReplyLinks.quickReply,
  )
  blockAndQuickReplyLinks: BlockAndQuickReplyLinkEntity[];

  @ManyToOne(() => BlockEntity, (blocks) => blocks.quickReplies, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'linked_block_id', referencedColumnName: 'id' }])
  linkedBlock: BlockEntity;
}
