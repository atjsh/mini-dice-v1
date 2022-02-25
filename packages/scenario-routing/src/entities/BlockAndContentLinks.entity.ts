import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BlockEntity } from './Blocks.entity';
import { ContentEntity } from './Contents.entity';

@Index('FK_block_and_content_links_blocks', ['blockId'], {})
@Index('FK_block_and_content_links_contents', ['contentId'], {})
@Index('FK_block_and_content_links_scenarios', ['scenarioId'], {})
@Entity('block_and_content_links', { schema: 'common_scenarios_A' })
export class BlockAndContentLinkEntity {
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

  @Column('int', { name: 'block_id', nullable: true })
  blockId: number | null;

  @Column('int', { name: 'content_id', nullable: true })
  contentId: number | null;

  @Column('int', { name: 'scenario_id', nullable: true })
  scenarioId: number | null;

  @Column('varchar', {
    name: 'name',
    nullable: true,
    length: 50,
    default: () => "'-'",
  })
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

  @ManyToOne(() => BlockEntity, (blocks) => blocks.blockAndContentLinks, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'block_id', referencedColumnName: 'id' }])
  block: BlockEntity;

  @ManyToOne(() => ContentEntity, (contents) => contents.blockAndContentLinks, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'content_id', referencedColumnName: 'id' }])
  content: ContentEntity;
}
