import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { abonante } from './abonante.entity';

@Entity()
export class Cobro {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  fecha: Date;

  @Column()
  metodoDeCobro: string;

  @OneToOne(() => abonante)
  @JoinColumn({ name: 'abonante_id' })
  abonante: abonante;
}