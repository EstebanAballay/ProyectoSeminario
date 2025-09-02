import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne } from 'typeorm';

@Entity("estadoTransportista")
export class estadoTransportista{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre:string;
}