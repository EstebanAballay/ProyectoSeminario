import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm';


@Entity("camion")
export class Camion {
    @PrimaryGeneratedColumn()
    id: number;

    //id estado camion
    @Column()
    EstadoCamion: number;

    @Column()
    patente:string;

    //id tipo camion
    @Column()
    tipoCamion: number;

}