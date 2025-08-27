import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { EstadoSemiremolque } from './estadoSemiremolque.entity';
import { Tipo } from './tipo.entity';

@Entity()
export class Semiremolque {
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

    @ManyToOne(() => EstadoSemiremolque, { eager: true })
    estado: EstadoSemiremolque;

    @ManyToOne(() => Tipo, { eager: true })
    tipo: Tipo;
}