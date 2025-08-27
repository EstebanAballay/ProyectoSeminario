import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne } from 'typeorm';

@Entity("estadoCamion")
export class EstadoCamion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;
}