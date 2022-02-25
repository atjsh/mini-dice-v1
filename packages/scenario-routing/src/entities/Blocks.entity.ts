import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UtteranceEntity } from './Utterances.entity';
import { BlockAndContentLinkEntity } from './BlockAndContentLinks.entity';
import { BlockAndQuickReplyLinkEntity } from './BlockAndQuickReplyLinks.entity';
import { ButtonEntity } from './Buttons.entity';
import { QuickReplieEntity } from './QuickReplies.entity';

@Index('code', ['code'], { unique: true })
@Entity('blocks', { schema: 'common_scenarios_A' })
export class BlockEntity {
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

  @Column('varchar', { name: 'code', unique: true, length: 100 })
  code: string;

  @Column('varchar', { name: 'type', length: 50 })
  type: string;

  @OneToMany(() => UtteranceEntity, (utterances) => utterances.linkedBlock)
  utterances: UtteranceEntity[];

  @OneToMany(
    () => BlockAndContentLinkEntity,
    (blockAndContentLinks) => blockAndContentLinks.block,
  )
  blockAndContentLinks: BlockAndContentLinkEntity[];

  @OneToMany(
    () => BlockAndQuickReplyLinkEntity,
    (blockAndQuickReplyLinks) => blockAndQuickReplyLinks.block,
  )
  blockAndQuickReplyLinks: BlockAndQuickReplyLinkEntity[];

  @OneToMany(() => ButtonEntity, (buttons) => buttons.linkedBlock)
  buttons: ButtonEntity[];

  @OneToMany(
    () => QuickReplieEntity,
    (quickReplies) => quickReplies.linkedBlock,
  )
  quickReplies: QuickReplieEntity[];
}
