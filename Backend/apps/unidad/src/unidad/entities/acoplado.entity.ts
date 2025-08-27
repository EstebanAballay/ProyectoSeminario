import { Entity, Column, PrimaryGeneratedColumn, ManyToOne} from 'typeorm';
import { EstadoAcoplado } from './estadoAcoplado.entity';

@Entity()
export class EstadoSemiremolque {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    patente: string;

    @Column("float")
    capacidad: number;

    @Column("float")
    precio: number;

    @Column()
    cantidadDeEjes: number;

    @ManyToOne(() => EstadoAcoplado, { eager: true })
    estado: EstadoAcoplado;
}