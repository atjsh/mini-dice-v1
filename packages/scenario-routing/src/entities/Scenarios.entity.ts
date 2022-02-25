import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CardAndButtonLinkEntity } from './CardAndButtonLinks.entity';
import { ContentAndCardLinkEntity } from './ContentAndCardLinks.entity';

@Entity('scenarios', { schema: 'common_scenarios_A' })
export class ScenarioEntity {
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

  @OneToMany(
    () => CardAndButtonLinkEntity,
    (cardAndButtonLinks) => cardAndButtonLinks.scenario,
  )
  cardAndButtonLinks: CardAndButtonLinkEntity[];

  @OneToMany(
    () => ContentAndCardLinkEntity,
    (contentAndCardLinks) => contentAndCardLinks.scenario,
  )
  contentAndCardLinks: ContentAndCardLinkEntity[];
}
