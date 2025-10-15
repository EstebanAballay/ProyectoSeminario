import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

//tipo de camion(es decir los que llevan motor)
@Entity({name:"tipoCamion",schema:'microservice_unidad'})
export class TipoCamion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

}