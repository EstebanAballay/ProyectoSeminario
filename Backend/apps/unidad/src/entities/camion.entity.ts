import { Entity, PrimaryGeneratedColumn, Column,OneToOne} from 'typeorm';
import { EstadoCamion } from './estadoCamion.entity';
import { TipoCamion } from './tipoCamion.entity';

@Entity("camion")
export class Camion {
    @PrimaryGeneratedColumn()
    id: number;

    //Relación con Semirremolque
    @OneToOne(() => EstadoCamion, { eager: true })
    EstadoCamion: EstadoCamion;

    @Column()
    patente:string;

    //id tipo camion
    @OneToOne(() => TipoCamion, { eager: true })
    tipoCamion: TipoCamion;

}