import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../role.enum';

@Entity({ name: 'user', schema: 'microservice_usuarios' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column()
  dni: string;

  @Column()
  email: string;

  @Column()
  celular: string;

  @Column()
  CUIT: string;

  @Column()
  direccion: string;

  @Column({ name: 'password_hash' })
  password_hash: string;

  @Column({ type: 'enum', enum: Role, default: Role.CLIENT })
  role: Role;
}
