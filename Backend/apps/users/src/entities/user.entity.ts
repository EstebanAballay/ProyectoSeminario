import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column()
  dni: number;

  @Column()
  email: string;

  @Column()
  telefono: number;

  @Column()
  CUIT: string;

  @Column()
  direccion: string;
}

