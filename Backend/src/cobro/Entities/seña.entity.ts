import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Cobro } from './cobro.entity';

@Entity()
export class seña {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Cobro)
  @JoinColumn({name:'id' })
  Cobro : Cobro;

}
