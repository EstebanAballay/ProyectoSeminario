import { Entity, PrimaryGeneratedColumn, Column, ManyToOne} from 'typeorm';
import { EstadoCamion } from './estadoCamion.entity';
import { TipoCamion } from './tipoCamion.entity';

@Entity({name:"camion",schema:'microservice_unidad'})
export class Camion {
    @PrimaryGeneratedColumn()
    id: number;

    //Relación con Semirremolque
    @ManyToOne(() => EstadoCamion, { eager: true })
    EstadoCamion: EstadoCamion;

    @Column()
    patente:string;

    //id tipo camion
    @ManyToOne(() => TipoCamion, { eager: true })
    tipoCamion: TipoCamion;

    @Column("float")
    precio: number;

    @Column("float")
    peso: number;

    @Column("float")
    cantidadEjes: number;
}