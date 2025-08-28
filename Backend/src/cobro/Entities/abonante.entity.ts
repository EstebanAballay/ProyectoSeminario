import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class abonante {
  @PrimaryGeneratedColumn()
 abonante_id: number;

  @Column()
  nombre: string;

  @Column()
  email: string;

  @Column()
  password: string;
}