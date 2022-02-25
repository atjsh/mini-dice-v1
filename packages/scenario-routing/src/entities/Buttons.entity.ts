import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BlockEntity } from './Blocks.entity';
import { CardAndButtonLinkEntity } from './CardAndButtonLinks.entity';

@Index('code', ['code'], { unique: true })
@Index('FK_buttons_blocks', ['linkedBlockId'], {})
@Entity('buttons', { schema: 'common_scenarios_A' })
export class ButtonEntity {
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

  @Column('varchar', { name: 'label', length: 100 })
  label: string;

  @Column('varchar', { name: 'type', length: 100 })
  type: string;

  @Column('text', { name: 'url', nullable: true })
  url: string | null;

  @Column('varchar', { name: 'code', unique: true, length: 100 })
  code: string;

  @Column('int', { name: 'linked_block_id', nullable: true })
  linkedBlockId: number | null;

  @Column('varchar', { name: 'button_type', nullable: true, length: 50 })
  buttonType: string | null;

  @Column('varchar', { name: 'etc', nullable: true, length: 50 })
  etc: string | null;

  @Column('varchar', { name: 'operation', nullable: true, length: 20 })
  operation: string | null;

  @ManyToOne(() => BlockEntity, (blocks) => blocks.buttons, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'linked_block_id', referencedColumnName: 'id' }])
  linkedBlock: BlockEntity;

  @OneToMany(
    () => CardAndButtonLinkEntity,
    (cardAndButtonLinks) => cardAndButtonLinks.button,
  )
  cardAndButtonLinks: CardAndButtonLinkEntity[];
}
