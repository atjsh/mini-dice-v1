import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CardEntity } from './Cards.entity';
import { ContentEntity } from './Contents.entity';
import { ScenarioEntity } from './Scenarios.entity';

@Index('FK_content_and_card_links_cards', ['cardId'], {})
@Index('FK_content_and_card_links_contents', ['contentId'], {})
@Index('fk_content_and_card_links_scenarios1_idx', ['scenarioId'], {})
@Entity('content_and_card_links', { schema: 'common_scenarios_A' })
export class ContentAndCardLinkEntity {
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

  @Column('int', { name: 'content_id', nullable: true })
  contentId: number | null;

  @Column('int', { name: 'card_id', nullable: true })
  cardId: number | null;

  @Column('varchar', { name: 'name', nullable: true, length: 50 })
  name: string | null;

  @Column('int', { name: 'depth', nullable: true, default: () => "'0'" })
  depth: number | null;

  @ManyToOne(() => CardEntity, (cards) => cards.contentAndCardLinks, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'card_id', referencedColumnName: 'id' }])
  card: CardEntity;

  @ManyToOne(() => ContentEntity, (contents) => contents.contentAndCardLinks, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'content_id', referencedColumnName: 'id' }])
  content: ContentEntity;

  @ManyToOne(
    () => ScenarioEntity,
    (scenarios) => scenarios.contentAndCardLinks,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
    },
  )
  @JoinColumn([{ name: 'scenario_id', referencedColumnName: 'id' }])
  scenario: ScenarioEntity;
}
