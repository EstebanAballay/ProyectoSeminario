import { Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

//tipo de acoplado y semirremolque,es decir los que son tirados
@Entity({name:"tipo",schema:'microservice_unidad'})
export class Tipo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    descripcion: string;
}