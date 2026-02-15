import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity({name:"estadoCamion",schema:'microservice_unidad'})
export class EstadoCamion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;
}
