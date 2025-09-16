import { Entity, Column, PrimaryGeneratedColumn,ManyToOne } from 'typeorm';
import { EstadoSemirremolque } from './estadoSemirremolque.entity';
import { Tipo } from './tipo.entity';

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
    @ManyToOne(() => EstadoSemirremolque, { eager: true })
    estado: EstadoSemirremolque;

    //id tipo semirremolque
    @ManyToOne(() => Tipo, { eager: true })
    tipo: Tipo;
}