import { Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity({name:"estadoAcoplado",schema:'microservice_unidad'})
export class EstadoAcoplado {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;
}