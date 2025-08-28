import { Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity("tipo")
export class Tipo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    descripcion: string;

    @Column("float")
    precio: number;
}