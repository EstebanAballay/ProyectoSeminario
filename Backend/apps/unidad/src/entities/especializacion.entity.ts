import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne } from 'typeorm';

@Entity("especializacion")
export class Especializacion{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre:string;
}