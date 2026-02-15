import { Entity, Column, PrimaryGeneratedColumn,ManyToOne } from 'typeorm';
import { EstadoSemirremolque } from './estadoSemirremolque.entity';
import { Tipo } from './tipo.entity';

@Entity({name:"semirremolque",schema:'microservice_unidad'})
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

    @ManyToOne(() => EstadoSemirremolque, { eager: true })
    estado: EstadoSemirremolque;

    @ManyToOne(() => Tipo, { eager: true })
    tipo: Tipo;
}