import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class Replay {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'jsonb' })
  data: any;
}
