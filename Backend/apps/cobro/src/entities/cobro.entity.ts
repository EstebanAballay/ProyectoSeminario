import { mainModule } from 'process';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { EstadoCobro } from './estadoCobro.entity';

@Entity({ name: 'cobro', schema: 'microservice_cobro' })
export class Cobro {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    viajeId: number;

    @Column({ type: 'numeric' })
    monto: number;

    @ManyToOne(() => EstadoCobro, { eager: true })
    @JoinColumn({ name: 'estadoId' })
    estado: EstadoCobro

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fechaCreacion: Date;

    @Column({ type: 'varchar', nullable: true })
    transactionId?: string;
}