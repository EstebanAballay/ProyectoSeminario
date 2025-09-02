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

  @Column()
  abonante: abonante;
}