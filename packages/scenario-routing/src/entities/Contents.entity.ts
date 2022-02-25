import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BlockAndContentLinkEntity } from './BlockAndContentLinks.entity';
import { ContentAndCardLinkEntity } from './ContentAndCardLinks.entity';

@Index('code', ['code'], { unique: true })
@Entity('contents', { schema: 'common_scenarios_A' })
export class ContentEntity {
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

  @Column('varchar', { name: 'card_type', length: 100 })
  cardType: string;

  @Column('varchar', {
    name: 'type',
    length: 100,
    default: () => "'card.text'",
  })
  type: string;

  @OneToMany(
    () => BlockAndContentLinkEntity,
    (blockAndContentLinks) => blockAndContentLinks.content,
  )
  blockAndContentLinks: BlockAndContentLinkEntity[];

  @OneToMany(
    () => ContentAndCardLinkEntity,
    (contentAndCardLinks) => contentAndCardLinks.content,
  )
  contentAndCardLinks: ContentAndCardLinkEntity[];
}
