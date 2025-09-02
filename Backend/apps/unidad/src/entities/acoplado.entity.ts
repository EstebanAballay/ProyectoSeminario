import { Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity("acoplado")
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

    //id estado unidad
    @Column()
    estado: number;
}