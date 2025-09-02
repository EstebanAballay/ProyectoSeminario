import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class abonante {
  @PrimaryGeneratedColumn()
  idAbonante: number;

  @Column()
  nombre: string;

  @Column()
  email: string;

  @Column()
  password: string;
}