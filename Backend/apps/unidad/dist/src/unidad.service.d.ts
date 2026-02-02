import { CreateUnidadDto } from './dto/create-unidad.dto';
import { UpdateUnidadDto } from './dto/update-unidad.dto';
import { HttpService } from '@nestjs/axios';
import { Semirremolque } from './entities/semirremolque.entity';
import { Acoplado } from './entities/acoplado.entity';
import { Repository } from 'typeorm';
import { Tipo } from './entities/tipo.entity';
import { TipoCamion } from './entities/tipoCamion.entity';
import { Camion } from './entities/camion.entity';
import { Unidad } from './entities/unidad.entity';
<<<<<<< HEAD
import { Transportista } from './entities/transportista.entity';
import { CreateVehicleDto } from './dto/create-Vehicle.dto';
import { EstadoCamion } from './entities/estadoCamion.entity';
import { EstadoAcoplado } from './entities/estadoAcoplado.entity';
import { EstadoSemirremolque } from './entities/estadoSemirremolque.entity';
=======
import { EstadoCamion } from './entities/estadoCamion.entity';
import { EstadoSemirremolque } from './entities/estadoSemirremolque.entity';
import { EstadoAcoplado } from './entities/estadoAcoplado.entity';
import { estadoTransportista } from './entities/estadoTransportista.entity';
import { Transportista } from './entities/transportista.entity';
>>>>>>> origin/cambiosChofer
export declare class UnidadService {
    private readonly httpService;
    private estadoSemirremolqueRepository;
    private estadoAcopladoRepository;
    private tipoRepository;
    private tipoCamionRepository;
    private CamionRepository;
    private UnidadRepository;
<<<<<<< HEAD
    private choferRepository;
    private estadoCamionRepository;
    private estadoAcopladoRepository;
    private estadoSemirremolqueRepository;
    constructor(httpService: HttpService, semirremolqueRepository: Repository<Semirremolque>, acopladoRepository: Repository<Acoplado>, tipoRepository: Repository<Tipo>, tipoCamionRepository: Repository<TipoCamion>, CamionRepository: Repository<Camion>, UnidadRepository: Repository<Unidad>, choferRepository: Repository<Transportista>, estadoCamionRepository: Repository<EstadoCamion>, estadoAcopladoRepository: Repository<EstadoAcoplado>, estadoSemirremolqueRepository: Repository<EstadoSemirremolque>);
=======
    private estadoCamionRepository;
    private EstadoSemirremolqueRepository;
    private EstadoAcopladoRepository;
    private estadoTransportistaRepository;
    private transportistaRepository;
    constructor(httpService: HttpService, estadoSemirremolqueRepository: Repository<Semirremolque>, estadoAcopladoRepository: Repository<Acoplado>, tipoRepository: Repository<Tipo>, tipoCamionRepository: Repository<TipoCamion>, CamionRepository: Repository<Camion>, UnidadRepository: Repository<Unidad>, estadoCamionRepository: Repository<EstadoCamion>, EstadoSemirremolqueRepository: Repository<EstadoSemirremolque>, EstadoAcopladoRepository: Repository<EstadoAcoplado>, estadoTransportistaRepository: Repository<estadoTransportista>, transportistaRepository: Repository<Transportista>);
>>>>>>> origin/cambiosChofer
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
    findAll(): string;
    findOne(id: number): Promise<Unidad[]>;
    update(id: number, updateUnidadDto: UpdateUnidadDto): string;
    remove(id: number): string;
<<<<<<< HEAD
    createVehicle(createUnidadDto: CreateVehicleDto): Promise<Camion | Acoplado | Semirremolque>;
=======
    findUnityByDriver(idusuario: number): Promise<any[]>;
    iniciarEstadoViaje(viajeId: number): Promise<void>;
    finalizarEstadoViaje(viajeId: number): Promise<void>;
>>>>>>> origin/cambiosChofer
}
