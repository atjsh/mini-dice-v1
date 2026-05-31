import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from 'typeorm';
import { v7 } from 'uuid';
import { UserEntity } from '../../../user/entity/user.entity';

@Entity({ name: 'tb_passkey' })
export class PasskeyEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @BeforeInsert()
  setPk() {
    this.id = v7();
  }

  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.passkeys, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: Relation<UserEntity>;

  @Column({ type: 'varchar', length: 512, unique: true })
  credentialId: string; // Base64 encoded

  @Column({ type: 'text' })
  publicKey: string; // Base64 encoded

  @Column({ type: 'int', default: 0 })
  counter: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  deviceType: string; // 'platform' | 'cross-platform'

  @Column({ type: 'simple-array', nullable: true })
  transports: string[]; // ['internal', 'usb', 'ble', 'nfc']

  @Column({ type: 'varchar', length: 100, nullable: true })
  aaguid: string;

  @Column({ type: 'varchar', length: 100, default: 'Passkey' })
  name: string; // User-friendly name

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastUsedAt: Date;
}
