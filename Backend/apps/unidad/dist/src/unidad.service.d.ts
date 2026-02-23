import { CreateUnidadDto } from './dto/create-unidad.dto';
import { HttpService } from '@nestjs/axios';
import { Semirremolque } from './entities/semirremolque.entity';
import { Acoplado } from './entities/acoplado.entity';
import { Repository } from 'typeorm';
import { Tipo } from './entities/tipo.entity';
import { TipoCamion } from './entities/tipoCamion.entity';
import { Camion } from './entities/camion.entity';
import { Unidad } from './entities/unidad.entity';
import { Transportista } from './entities/transportista.entity';
import { CreateVehicleDto } from './dto/create-Vehicle.dto';
import { EstadoCamion } from './entities/estadoCamion.entity';
import { EstadoAcoplado } from './entities/estadoAcoplado.entity';
import { EstadoSemirremolque } from './entities/estadoSemirremolque.entity';
import { estadoTransportista } from './entities/estadoTransportista.entity';
export declare class UnidadService {
    private readonly httpService;
    private semirremolqueRepository;
    private acopladoRepository;
    private tipoRepository;
    private tipoCamionRepository;
    private CamionRepository;
    private UnidadRepository;
    private estadoCamionRepository;
    private EstadoSemirremolqueRepository;
    private EstadoAcopladoRepository;
    private estadoTransportistaRepository;
    private transportistaRepository;
    constructor(httpService: HttpService, semirremolqueRepository: Repository<Semirremolque>, acopladoRepository: Repository<Acoplado>, tipoRepository: Repository<Tipo>, tipoCamionRepository: Repository<TipoCamion>, CamionRepository: Repository<Camion>, UnidadRepository: Repository<Unidad>, estadoCamionRepository: Repository<EstadoCamion>, EstadoSemirremolqueRepository: Repository<EstadoSemirremolque>, EstadoAcopladoRepository: Repository<EstadoAcoplado>, estadoTransportistaRepository: Repository<estadoTransportista>, transportistaRepository: Repository<Transportista>);
    testConnection(): Promise<void>;
    private getRandomItem;
    createUnidad(dto: CreateUnidadDto): Promise<Unidad>;
    consultarTiposAcoplados(): Promise<Tipo[]>;
    consultarTiposCamiones(): Promise<TipoCamion[]>;
    findDisponibles(unidadesOcupadas: number[]): Promise<{
        camiones: Camion[];
        acoplados: any;
        semirremolques: any;
    }>;
    findUnidadesDisponiblesByTipoRandom(camionesPedidos: any[], unidadesDisponibles: any): {
        unidadesFormadas: any[];
        errores: string[];
    };
    getChoferesDisponibles(idViajesEnRango: number[]): Promise<any>;
    asignarChoferes(asignaciones: {
        unidadId: number;
        choferId: number;
    }[]): void;
    findOne(id: number): Promise<Unidad>;
    createVehicle(createUnidadDto: CreateVehicleDto): Promise<Camion | Acoplado | Semirremolque>;
    findUnityByDriver(idviaje: number): Promise<any[]>;
    iniciarEstadoViaje(viajeId: number): Promise<void>;
    finalizarEstadoViaje(viajeId: number): Promise<void>;
    findAll(): Promise<Unidad[]>;
}
