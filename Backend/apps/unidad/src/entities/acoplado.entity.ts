import { Entity, Column, PrimaryGeneratedColumn,ManyToOne} from 'typeorm';
import { EstadoAcoplado } from './estadoAcoplado.entity';
import { Tipo } from './tipo.entity';

@Entity({name:"acoplado",schema:'microservice_unidad'})
export class Acoplado {
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

    @ManyToOne(() => Tipo, { eager: true })
    tipo: Tipo;
}