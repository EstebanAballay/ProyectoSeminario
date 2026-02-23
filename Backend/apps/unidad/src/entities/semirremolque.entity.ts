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

<<<<<<< HEAD
=======
    
>>>>>>> a377986c5a6f551265fb79b36c6382d819ea995d
    @ManyToOne(() => EstadoSemirremolque, { eager: true })
    estado: EstadoSemirremolque;

    @ManyToOne(() => Tipo, { eager: true })
    tipo: Tipo;
}