import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class FrontendErrorEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
  })
  error: string;
}
