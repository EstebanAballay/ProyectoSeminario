import { Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity("estadoAcoplado")
export class EstadoAcoplado {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;
}