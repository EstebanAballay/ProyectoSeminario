import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Cobro } from './cobro.entity';

@Entity()
export class seña {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  Cobro : Cobro;

}
