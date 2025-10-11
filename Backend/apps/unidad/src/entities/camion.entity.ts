import { Entity, PrimaryGeneratedColumn, Column, ManyToOne} from 'typeorm';
import { EstadoCamion } from './estadoCamion.entity';
import { TipoCamion } from './tipoCamion.entity';

@Entity("camion")
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

}