import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ButtonEntity } from './Buttons.entity';
import { CardEntity } from './Cards.entity';
import { ScenarioEntity } from './Scenarios.entity';

@Index('FK_card_and_button_links_buttons', ['buttonId'], {})
@Index('FK_card_and_button_links_cards', ['cardId'], {})
@Index('fk_card_and_button_links_scenarios1_idx', ['scenarioId'], {})
@Entity('card_and_button_links', { schema: 'common_scenarios_A' })
export class CardAndButtonLinkEntity {
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

  @Column('int', { name: 'card_id', nullable: true })
  cardId: number | null;

  @Column('int', { name: 'button_id', nullable: true })
  buttonId: number | null;

  @ManyToOne(() => ButtonEntity, (buttons) => buttons.cardAndButtonLinks, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'button_id', referencedColumnName: 'id' }])
  button: ButtonEntity;

  @ManyToOne(() => CardEntity, (cards) => cards.cardAndButtonLinks, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'card_id', referencedColumnName: 'id' }])
  card: CardEntity;

  @ManyToOne(
    () => ScenarioEntity,
    (scenarios) => scenarios.cardAndButtonLinks,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
    },
  )
  @JoinColumn([{ name: 'scenario_id', referencedColumnName: 'id' }])
  scenario: ScenarioEntity;
}
