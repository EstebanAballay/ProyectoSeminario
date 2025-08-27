import { Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
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