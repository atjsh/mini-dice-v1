import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CardAndButtonLinkEntity } from './CardAndButtonLinks.entity';
import { ContentAndCardLinkEntity } from './ContentAndCardLinks.entity';

@Entity('cards', { schema: 'common_scenarios_A' })
export class CardEntity {
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

  @Column('varchar', { name: 'name', nullable: true, length: 100 })
  name: string | null;

  @Column('text', { name: 'description', nullable: true })
  description: string | null;

  @Column('text', { name: 'image_url', nullable: true })
  imageUrl: string | null;

  @Column('varchar', { name: 'title', nullable: true, length: 100 })
  title: string | null;

  @Column('varchar', { name: 'text', nullable: true, length: 50 })
  text: string | null;

  @OneToMany(
    () => CardAndButtonLinkEntity,
    (cardAndButtonLinks) => cardAndButtonLinks.card,
  )
  cardAndButtonLinks: CardAndButtonLinkEntity[];

  @OneToMany(
    () => ContentAndCardLinkEntity,
    (contentAndCardLinks) => contentAndCardLinks.card,
  )
  contentAndCardLinks: ContentAndCardLinkEntity[];
}
