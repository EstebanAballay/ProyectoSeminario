import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity("semirremolque")
export class Semirremolque {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    cantidadDeEjes: number;

    @Column()
    patente: string;

    @Column("float")
    capacidad: number;

    @Column("float")
    precio: number;

    //id estado unidad
    @Column()
    estado: number;

    //id tipo semirremolque
    @Column()
    tipo: number;
}