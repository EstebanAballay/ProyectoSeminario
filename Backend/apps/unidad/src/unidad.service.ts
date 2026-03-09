import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUnidadDto } from './dto/create-unidad.dto';
import { UpdateUnidadDto } from './dto/update-unidad.dto';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Semirremolque } from './entities/semirremolque.entity';
import { Acoplado } from './entities/acoplado.entity';
import { Repository } from 'typeorm';
import { Tipo } from './entities/tipo.entity';
import { TipoCamion } from './entities/tipoCamion.entity';
import { Camion } from './entities/camion.entity';
import { Unidad } from './entities/unidad.entity'
import { In, Not } from 'typeorm';
import { Transportista } from './entities/transportista.entity';
import { lastValueFrom } from 'rxjs';
import { CreateVehicleDto } from './dto/create-Vehicle.dto';
import { EstadoCamion } from './entities/estadoCamion.entity';
import { EstadoAcoplado } from './entities/estadoAcoplado.entity';
import { EstadoSemirremolque } from './entities/estadoSemirremolque.entity';
import { estadoTransportista } from './entities/estadoTransportista.entity';
import { CreateTransportistaFromUserDto } from './dto/create-transportista-from-user.dto';

type TipoVehiculo = 'camion' | 'acoplado' | 'semirremolque';

@Injectable()
export class UnidadService {
  constructor(private readonly httpService: HttpService,
    @InjectRepository(Semirremolque) private semirremolqueRepository: Repository<Semirremolque>,
    @InjectRepository(Acoplado) private acopladoRepository: Repository<Acoplado>,
    @InjectRepository(Tipo) private tipoRepository: Repository<Tipo>,
    @InjectRepository(TipoCamion) private tipoCamionRepository: Repository<TipoCamion>,
    @InjectRepository(Camion) private CamionRepository: Repository<Camion>,
    @InjectRepository(Unidad) private UnidadRepository: Repository<Unidad>,
    @InjectRepository(EstadoCamion) private estadoCamionRepository: Repository<EstadoCamion>,
    @InjectRepository(EstadoSemirremolque) private EstadoSemirremolqueRepository: Repository<EstadoSemirremolque>,
    @InjectRepository(EstadoAcoplado) private EstadoAcopladoRepository: Repository<EstadoAcoplado>,
    @InjectRepository(estadoTransportista) private estadoTransportistaRepository: Repository<estadoTransportista>,
    @InjectRepository(Transportista) private transportistaRepository: Repository<Transportista>,
  ) { }

  async testConnection() {
    try {
      const count = await this.UnidadRepository.count();
      console.log('DB connection works, Unidad count:', count);
      await this.asegurarEstadoEnEsperaParaTransportistas();
    }
    catch (error) {
      console.error('DB connection failed:', error);
    }
  }

  //Funcion para obtener un item random de un array
  private getRandomItem<T>(items: T[]): T {
    if (!items || items.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
  }

  async createUnidad(dto: CreateUnidadDto): Promise<Unidad> {
    console.log("el dto de unidad es:", dto)
    // Buscar el camión
    const camion = await this.CamionRepository.findOneBy({ id: dto.tractoCamionId });
    if (!camion) {
      throw new NotFoundException(`Camión con id ${dto.tractoCamionId} no encontrado`);
    }

    // Buscar semirremolque si aplica
    let semirremolque: Semirremolque | null = null;
    if (dto.tieneSemirremolque && dto.semiremolqueId) {
      semirremolque = await this.semirremolqueRepository.findOneBy({ id: dto.semiremolqueId });
      if (!semirremolque) {
        throw new NotFoundException(`Semirremolque con id ${dto.semiremolqueId} no encontrado`);
      }
    }

    // Buscar acoplado si aplica
    let acoplado: Acoplado | null = null;
    if (dto.tieneAcoplado && dto.acopladoId) {
      acoplado = await this.acopladoRepository.findOneBy({ id: dto.acopladoId });
      if (!acoplado) {
        throw new NotFoundException(`Acoplado con id ${dto.acopladoId} no encontrado`);
      }
    }

    const subtotal = (semirremolque?.precio ?? 0) + (camion?.precio ?? 0) + (acoplado?.precio ?? 0);
    // Crear la unidad
    const unidad = this.UnidadRepository.create({
      idViaje: dto.viajeId,
      camion: camion,
      semiremolque: semirremolque || null,
      acoplado: acoplado || null,
      subtotal: subtotal
    });

    // Guardar
    return this.UnidadRepository.save(unidad);
  }

  consultarTiposAcoplados(): Promise<Tipo[]> {
    return this.tipoRepository.find();
  }

  consultarTiposCamiones(): Promise<TipoCamion[]> {
    console.log("el error salta despues")
    return this.tipoCamionRepository.find();
  }

  //Busca las unidades disponibles
  async findDisponibles(unidadesOcupadas: number[]): Promise<{
    camiones: Camion[];
    acoplados: any;
    semirremolques: any;
  }> {
    const unidades = await this.UnidadRepository.find({
      where: { UnidadId: In(unidadesOcupadas) },
      relations: ['camion', 'acoplado', 'semiremolque'],
    });

    const camionesOcupados = unidades.map(u => u.camion?.id).filter(Boolean);
    const acopladosOcupados = unidades.map(u => u.acoplado?.id).filter(Boolean);
    const semirremolquesOcupados = unidades.map(u => u.semiremolque?.id).filter(Boolean);

    const camionesDisponibles = (await this.CamionRepository.find({
      where: { id: Not(In(camionesOcupados)) },
    })).map(c => ({ ...c, tipo: c.tipoCamion.nombre }));;

    const acopladosDisponibles = (await this.acopladoRepository.find({
      where: { id: Not(In(acopladosOcupados)) },
    })).map(c => ({ ...c, tipo: c.tipo.nombre }));;

    const semirremolquesDisponibles = (await this.semirremolqueRepository.find({
      where: { id: Not(In(semirremolquesOcupados)) },
    })).map(c => ({ ...c, tipo: c.tipo.nombre }));;

    return {
      camiones: camionesDisponibles,
      acoplados: acopladosDisponibles,
      semirremolques: semirremolquesDisponibles,
    };
  }


  //Gran funcion para encontrar unidades disponibles segun el tipo pedido
  findUnidadesDisponiblesByTipoRandom(camionesPedidos: any[], unidadesDisponibles: any): {
    unidadesFormadas: any[]; errores: string[];
  } {
    console.log('Camiones pedidos:', camionesPedidos);
    const { camiones, acoplados, semirremolques } = unidadesDisponibles;
    const unidadesFormadas: any[] = [];
    const errores: string[] = [];
    const usadosCamiones = new Set<number>();
    const usadosSemirremolques = new Set<number>();
    const usadosAcoplados = new Set<number>();

    console.log('Los tipos de los camiones disponibles son:', camiones.map(c => c.tipo));

    // Función auxiliar para elegir un elemento aleatorio
    const elegirRandom = <T>(array: T[]): T | undefined => {
      if (!array || array.length === 0) return undefined;
      const index = Math.floor(Math.random() * array.length);
      return array[index];
    };

    //lo hice para debugear nomas
    if (!camionesPedidos || !Array.isArray(camionesPedidos)) {
      console.error('camionesPedidos no está definido o no es un array:', camionesPedidos);
      return { unidadesFormadas: [], errores: ['camionesPedidos no está definido o no es un array'] };
    }

    for (const [index, pedido] of camionesPedidos.entries()) {
      const { tipo, semirremolque, acoplado } = pedido;
      console.log('El tipo del camion pedido es', tipo);

      // --- Buscar camiones disponibles del tipo pedido ---
      const camionesDisponibles = camiones.filter(c => c.tipoCamion.nombre === tipo && !usadosCamiones.has(c.id));
      const camion = elegirRandom(camionesDisponibles) as Camion || undefined;
      console.log('el camion es:', camion);
      if (!camion) {
        errores.push(`No se encontró camión disponible del tipo "${tipo}" (pedido ${index + 1}).`);
        continue;
      }

      usadosCamiones.add(camion.id);

      // --- Buscar semirremolques disponibles ---
      let semi = null;
      console.log(semirremolque.trim().toLowerCase());
      if (semirremolque && semirremolque.trim().toLowerCase() !== 'sin semirremolque' && camion.tipoCamion.nombre.toLowerCase() === 'tractocamion') {
        if (tipo === 'tractoCamion' || semirremolque) {
          const semisDisponibles = semirremolques.filter(s => s.tipo.toLowerCase() === semirremolque.toLowerCase() && !usadosSemirremolques.has(s.id));
          semi = elegirRandom(semisDisponibles);
          if (!semi) {
            errores.push(`No se encontró semirremolque del tipo "${semirremolque}" (pedido ${index + 1}).`);
            //aca si no encuentro el semi,borro al camion para limpiar la variable
            usadosSemirremolques.delete(camion.id);
            continue;
          }
          usadosSemirremolques.add(semi.id);
        }
      }
      // --- Buscar acoplado (si aplica) ---
      let acopladoEncontrado = null;

      if (acoplado && acoplado.trim().toLowerCase() !== 'sin acoplado' && camion.tipoCamion.nombre.toLowerCase() === 'tractocamion') {
        const tipoAcoplado = String(acoplado).trim().toLowerCase();

        //busco acoplados por el tipo y que no hayan sido usados,de entre los disponibles
        const acopladosDisponibles = acoplados.filter(a =>
          a.tipo.trim().toLowerCase() === tipoAcoplado && !usadosAcoplados.has(a.id)
        );

        console.log('los usados son: ', usadosAcoplados);
        console.log('los acoplados disponibles son:', acopladosDisponibles);
        console.log('🔎 Buscando tipo:', tipoAcoplado);
        console.log('📦 Disponibles:', acopladosDisponibles.map(a => a.id));

        acopladoEncontrado = elegirRandom(acopladosDisponibles);
        console.log('Encontrado acoplado:', acopladoEncontrado);
        if (!acopladoEncontrado) {
          errores.push(`No se encontró acoplado del tipo "${acoplado}" (pedido ${index + 1}).`);
          //aca si no encuentro al acoplado,borro al camion para limpiar la variable
          usadosAcoplados.delete(camion.id);
          if (semi) usadosAcoplados.delete(semi.id);
          continue;
        }

        usadosAcoplados.add(acopladoEncontrado.id);
      }
      const cargaTotal = camion.peso + (semi ? semi.capacidad : 0) + (acopladoEncontrado ? acopladoEncontrado.capacidad : 0);
      const subtotal = camion.precio + (semi ? semi.precio : 0) + (acopladoEncontrado ? acopladoEncontrado.precio : 0);

      // --- Si todo salió bien, armamos la unidad ---
      console.log("llego hasta aca");
      unidadesFormadas.push({
        camion: camion,
        semirremolque: semi,
        acoplado: acopladoEncontrado,
        cargaTotal: cargaTotal,
        subtotal: subtotal
      });
    }
    console.log('Unidades formadas:', unidadesFormadas);
    return { unidadesFormadas, errores };
  }

  async getChoferesDisponibles(idViajesEnRango: number[]) {
    // Si no hay viajes, no hay unidades que buscar, entonces devuelvo todos los choferes
    if (!idViajesEnRango) {
      console.log('No hay viajes en el rango proporcionado.');
      const allChoferes = await this.transportistaRepository.find();
      const idsParaSolicitar = allChoferes.map(c => c.idUsuario);

      const { data } = await lastValueFrom(
        this.httpService.get(`${process.env.USERS_SERVICE_URL}/users/by-ids`, {
          params: {
            ids: idsParaSolicitar.join(',') // Ahora sí es un string "1,2,3"
          }
        })
      );
      console.log('los choferes son:', data);
      return data;
    }

    // Buscar unidades asociadas a los viajes en el rango
    const unidadesEnRango = await this.UnidadRepository.find({
      where: { idViaje: In(idViajesEnRango) },
      relations: ['transportista']
    });

    // Busco los IDs de los choferes ocupados
    // Usamos un Set para evitar duplicados si un chofer tiene varios viajes
    const idsOcupados = [...new Set(unidadesEnRango.map(u => u.transportista.idUsuario))];

    let opcionesBusqueda = {};

    // Solo aplicamos el filtro Not(In(...)) si realmente hay alguien ocupado
    if (idsOcupados.length > 0) {
      opcionesBusqueda = {
        where: { idUsuario: Not(In(idsOcupados)) },
      };
    }

    // Busco los choferes disponibles (Entities)
    const choferesDisponibles = await this.transportistaRepository.find(opcionesBusqueda);

    console.log('IDs de choferes disponibles:', choferesDisponibles.map(c => c.idUsuario));

    if (choferesDisponibles.length === 0) return [];

    const idsParaSolicitar = choferesDisponibles.map(c => c.idUsuario);

    const { data } = await lastValueFrom(
      this.httpService.get(`${process.env.USERS_SERVICE_URL}/users/by-ids`, {
        params: {
          ids: idsParaSolicitar.join(',')
        }
      })
    );

    return data;
  }

  asignarChoferes(asignaciones: { unidadId: number, choferId: number }[]) {
    for (const asignacion of asignaciones)
      this.UnidadRepository.update(asignacion.unidadId, { transportista: { idUsuario: asignacion.choferId } });
  }

  /*
     async findUnityByDriver(idusuario: number): Promise<Unidad[]> {
      return this.UnidadesRepository.find({
        where: { idTransportista: idusuario },
      });
    }
  */

  async find(id: number) {
    const unidad = await this.UnidadRepository.find({ where: { idViaje: id }, relations: ['camion', 'semiremolque', 'acoplado'] });
    console.log(unidad);
    return unidad;
  }

  async findOne(id: number) {
    const unidad = await this.UnidadRepository.findOne({ where: { idViaje: id }, relations: ['camion', 'semiremolque', 'acoplado'] });
    console.log(unidad);
    return unidad;
  }

  async createVehicle(createUnidadDto: CreateVehicleDto) {
    if (createUnidadDto.unidadTipo.toLowerCase() === 'camion') {
      // Lógica para crear un camión
      const nuevoCamion = this.CamionRepository.create({
        tipoCamion: await this.tipoCamionRepository.findOneBy({ nombre: createUnidadDto.unidadSubtipo }),
        patente: createUnidadDto.patente,
        peso: createUnidadDto.capacidad,
        precio: createUnidadDto.precioKm,
        estadoCamion: await this.estadoCamionRepository.findOneBy({ nombre: 'disponible' }),
        cantidadEjes: createUnidadDto.cantidadEjes
      });
      return this.CamionRepository.save(nuevoCamion);

    } else if (createUnidadDto.unidadTipo.toLowerCase() === 'acoplado') {
      // Lógica para crear un acoplado
      const nuevoAcoplado = this.acopladoRepository.create({
        tipo: await this.tipoRepository.findOneBy({ nombre: createUnidadDto.unidadSubtipo }),
        patente: createUnidadDto.patente,
        capacidad: createUnidadDto.capacidad,
        precio: createUnidadDto.precioKm,
        estado: await this.EstadoAcopladoRepository.findOneBy({ nombre: 'disponible' }),
        cantidadDeEjes: createUnidadDto.cantidadEjes
      });
      return this.acopladoRepository.save(nuevoAcoplado);

    } else if (createUnidadDto.unidadTipo.toLowerCase() === 'semirremolque') {
      // Lógica para crear un semirremolque
      const nuevoSemirremolque = this.semirremolqueRepository.create({
        tipo: await this.tipoRepository.findOneBy({ nombre: createUnidadDto.unidadSubtipo }),
        patente: createUnidadDto.patente,
        capacidad: createUnidadDto.capacidad,
        precio: createUnidadDto.precioKm,
        estado: await this.EstadoSemirremolqueRepository.findOneBy({ nombre: 'disponible' }),
        cantidadDeEjes: createUnidadDto.cantidadEjes
      });
      return this.semirremolqueRepository.save(nuevoSemirremolque);
    }
  }

  async findUnityByDriver(idviaje: number): Promise<any[]> {
    return this.UnidadRepository.find({
      where: { idViaje: idviaje },
    });
  }

  //funcion para cambiar el estado de todos los vehiculos adentro de la unidad asignada al viaje (sin pasar el estado)
  //funcion para cambiar el estado de todos los vehiculos adentro de la unidad asignada al viaje
  async iniciarEstadoViaje(viajeId: number): Promise<void> {
    const unidades = await this.UnidadRepository.find({
      where: { idViaje: viajeId },
      relations: ['camion', 'semiremolque', 'acoplado', 'transportista'], // ✅ agregado transportista
    });

    const estadoCamion = await this.estadoCamionRepository.findOne({ where: { nombre: 'enViaje' } });
    const estadoSemirremolque = await this.EstadoSemirremolqueRepository.findOne({ where: { nombre: 'enViaje' } });
    const estadoAcoplado = await this.EstadoAcopladoRepository.findOne({ where: { nombre: 'enViaje' } });
    const estadoTransportista = await this.estadoTransportistaRepository.findOne({ where: { nombre: 'enViaje' } });

    //obtener cada de vehiculo de cada unidad y cambiar su estado

    for (const unidad of unidades) {

      if (unidad.camion && estadoCamion) {
        unidad.camion.estadoCamion = estadoCamion;
        await this.CamionRepository.save(unidad.camion);
      }

      if (unidad.semiremolque && estadoSemirremolque) {
        unidad.semiremolque.estado = estadoSemirremolque;
        await this.semirremolqueRepository.save(unidad.semiremolque);
      }

      if (unidad.acoplado && estadoAcoplado) {
        unidad.acoplado.estado = estadoAcoplado;
        await this.acopladoRepository.save(unidad.acoplado);
      }

      // ✅ protección contra undefined
      if (unidad.transportista && estadoTransportista) {
        const transportista = await this.transportistaRepository.findOne({
          where: { idUsuario: unidad.transportista.idUsuario }
        });

        if (transportista) {
          transportista.estado = estadoTransportista;
          await this.transportistaRepository.save(transportista);
        }
      }
    }
  }


  async finalizarEstadoViaje(viajeId: number): Promise<void> {
    const unidades = await this.UnidadRepository.find({
      where: { idViaje: viajeId },
      relations: ['camion', 'semiremolque', 'acoplado', 'transportista'], // ✅ agregado transportista
    });

    const estadoCamion = await this.estadoCamionRepository.findOne({ where: { nombre: 'disponible' } });
    const estadoSemirremolque = await this.EstadoSemirremolqueRepository.findOne({ where: { nombre: 'disponible' } });
    const estadoAcoplado = await this.EstadoAcopladoRepository.findOne({ where: { nombre: 'disponible' } });
    const estadoTransportista = await this.estadoTransportistaRepository.findOne({ where: { nombre: 'disponible' } });

    for (const unidad of unidades) {

      if (unidad.camion && estadoCamion) {
        unidad.camion.estadoCamion = estadoCamion;
        await this.CamionRepository.save(unidad.camion);
      }

      if (unidad.semiremolque && estadoSemirremolque) {
        unidad.semiremolque.estado = estadoSemirremolque;
        await this.semirremolqueRepository.save(unidad.semiremolque);
      }

      if (unidad.acoplado && estadoAcoplado) {
        unidad.acoplado.estado = estadoAcoplado;
        await this.acopladoRepository.save(unidad.acoplado);
      }

      // ✅ protección contra undefined
      if (unidad.transportista && estadoTransportista) {
        const transportista = await this.transportistaRepository.findOne({
          where: { idUsuario: unidad.transportista.idUsuario }
        });

        if (transportista) {
          transportista.estado = estadoTransportista;
          await this.transportistaRepository.save(transportista);
        }
      }
    }
  }

  async findAll() {
    return await this.UnidadRepository.find();
  }

  // En UnidadService (Microservicio Unidad)
  async findViajesPorChofer(choferId: number) {
    console.log(`Buscando unidades para chofer ID: ${choferId}`);

    const unidades = await this.UnidadRepository.find({
      where: { transportista: { idUsuario: choferId } },
      relations: ['camion', 'semiremolque', 'acoplado'] // Traer detalles visuales para el front
    });
    console.log(`Encontradas ${unidades.length} unidades para este chofer.`);
    return unidades;
  }


  //Funciones para la consulta de admin
  private normalizarTipoVehiculo(tipo: string): TipoVehiculo {
    const tipoNormalizado = (tipo || '').toLowerCase();
    if (tipoNormalizado === 'camion' || tipoNormalizado === 'acoplado' || tipoNormalizado === 'semirremolque') {
      return tipoNormalizado;
    }
    throw new BadRequestException('Tipo de vehículo inválido');
  }

  private async obtenerEstadoPorNombre<T extends { nombre: string }>(repo: Repository<T>, nombre: string): Promise<T> {
    let estado = await repo
      .createQueryBuilder('estado')
      .where('LOWER(estado.nombre) = LOWER(:nombre)', { nombre })
      .getOne();

    if (!estado) {
      estado = repo.create({ nombre } as T);
      estado = await repo.save(estado);
    }

    return estado;
  }

  private mapCamionAdmin(camion: Camion) {
    return {
      id: camion.id,
      tipo: 'camion',
      subtipo: camion.tipoCamion?.nombre,
      patente: camion.patente,
      capacidad: camion.peso,
      precioKm: camion.precio,
      cantidadEjes: camion.cantidadEjes,
      estado: camion.estadoCamion?.nombre,
    };
  }

  private mapAcopladoAdmin(acoplado: Acoplado) {
    return {
      id: acoplado.id,
      tipo: 'acoplado',
      subtipo: acoplado.tipo?.nombre,
      patente: acoplado.patente,
      capacidad: acoplado.capacidad,
      precioKm: acoplado.precio,
      cantidadEjes: acoplado.cantidadDeEjes,
      estado: acoplado.estado?.nombre,
    };
  }

  private mapSemirremolqueAdmin(semirremolque: Semirremolque) {
    return {
      id: semirremolque.id,
      tipo: 'semirremolque',
      subtipo: semirremolque.tipo?.nombre,
      patente: semirremolque.patente,
      capacidad: semirremolque.capacidad,
      precioKm: semirremolque.precio,
      cantidadEjes: semirremolque.cantidadDeEjes,
      estado: semirremolque.estado?.nombre,
    };
  }

  async listarVehiculosAdmin() {
    const [camiones, acoplados, semirremolques] = await Promise.all([
      this.CamionRepository.find(),
      this.acopladoRepository.find(),
      this.semirremolqueRepository.find(),
    ]);

    return [
      ...camiones.map((camion) => this.mapCamionAdmin(camion)),
      ...acoplados.map((acoplado) => this.mapAcopladoAdmin(acoplado)),
      ...semirremolques.map((semirremolque) => this.mapSemirremolqueAdmin(semirremolque)),
    ];
  }

  async cambiarEstadoVehiculo(tipo: string, id: number, estadoNombre: string) {
    const tipoNormalizado = this.normalizarTipoVehiculo(tipo);
    const nuevoEstado = (estadoNombre || '').trim();

    if (!nuevoEstado) {
      throw new BadRequestException('Debe enviar un estado válido');
    }

    if (tipoNormalizado === 'camion') {
      const camion = await this.CamionRepository.findOneBy({ id });
      if (!camion) {
        throw new NotFoundException('Camión no encontrado');
      }

      camion.estadoCamion = await this.obtenerEstadoPorNombre(this.estadoCamionRepository, nuevoEstado);
      const actualizado = await this.CamionRepository.save(camion);
      return this.mapCamionAdmin(actualizado);
    }

    if (tipoNormalizado === 'acoplado') {
      const acoplado = await this.acopladoRepository.findOneBy({ id });
      if (!acoplado) {
        throw new NotFoundException('Acoplado no encontrado');
      }

      acoplado.estado = await this.obtenerEstadoPorNombre(this.EstadoAcopladoRepository, nuevoEstado);
      const actualizado = await this.acopladoRepository.save(acoplado);
      return this.mapAcopladoAdmin(actualizado);
    }

    const semirremolque = await this.semirremolqueRepository.findOneBy({ id });
    if (!semirremolque) {
      throw new NotFoundException('Semirremolque no encontrado');
    }

    semirremolque.estado = await this.obtenerEstadoPorNombre(this.EstadoSemirremolqueRepository, nuevoEstado);
    const actualizado = await this.semirremolqueRepository.save(semirremolque);
    return this.mapSemirremolqueAdmin(actualizado);
  }

  async modificarVehiculo(tipo: string, id: number, data: Partial<CreateVehicleDto>) {
    const tipoNormalizado = this.normalizarTipoVehiculo(tipo);

    if (tipoNormalizado === 'camion') {
      const camion = await this.CamionRepository.findOneBy({ id });
      if (!camion) {
        throw new NotFoundException('Camión no encontrado');
      }

      if (data.unidadSubtipo) {
        camion.tipoCamion = await this.tipoCamionRepository.findOneBy({ nombre: data.unidadSubtipo });
      }
      if (data.patente !== undefined) camion.patente = data.patente;
      if (data.capacidad !== undefined) camion.peso = Number(data.capacidad);
      if (data.precioKm !== undefined) camion.precio = Number(data.precioKm);
      if (data.cantidadEjes !== undefined) camion.cantidadEjes = Number(data.cantidadEjes);

      const actualizado = await this.CamionRepository.save(camion);
      return this.mapCamionAdmin(actualizado);
    }

    if (tipoNormalizado === 'acoplado') {
      const acoplado = await this.acopladoRepository.findOneBy({ id });
      if (!acoplado) {
        throw new NotFoundException('Acoplado no encontrado');
      }

      if (data.unidadSubtipo) {
        acoplado.tipo = await this.tipoRepository.findOneBy({ nombre: data.unidadSubtipo });
      }
      if (data.patente !== undefined) acoplado.patente = data.patente;
      if (data.capacidad !== undefined) acoplado.capacidad = Number(data.capacidad);
      if (data.precioKm !== undefined) acoplado.precio = Number(data.precioKm);
      if (data.cantidadEjes !== undefined) acoplado.cantidadDeEjes = Number(data.cantidadEjes);

      const actualizado = await this.acopladoRepository.save(acoplado);
      return this.mapAcopladoAdmin(actualizado);
    }

    const semirremolque = await this.semirremolqueRepository.findOneBy({ id });
    if (!semirremolque) {
      throw new NotFoundException('Semirremolque no encontrado');
    }

    if (data.unidadSubtipo) {
      semirremolque.tipo = await this.tipoRepository.findOneBy({ nombre: data.unidadSubtipo });
    }
    if (data.patente !== undefined) semirremolque.patente = data.patente;
    if (data.capacidad !== undefined) semirremolque.capacidad = Number(data.capacidad);
    if (data.precioKm !== undefined) semirremolque.precio = Number(data.precioKm);
    if (data.cantidadEjes !== undefined) semirremolque.cantidadDeEjes = Number(data.cantidadEjes);

    const actualizado = await this.semirremolqueRepository.save(semirremolque);
    return this.mapSemirremolqueAdmin(actualizado);
  }

  private async obtenerEstadoEnEspera() {
    let estado = await this.estadoTransportistaRepository
      .createQueryBuilder('estado')
      .where('LOWER(estado.nombre) = LOWER(:nombre)', { nombre: 'EnEspera' })
      .getOne();

    if (!estado) {
      estado = this.estadoTransportistaRepository.create({ nombre: 'EnEspera' });
      estado = await this.estadoTransportistaRepository.save(estado);
    }

    return estado;
  }

  private async asegurarEstadoEnEsperaParaTransportistas() {
    const estadoEnEspera = await this.obtenerEstadoEnEspera();
    const transportistas = await this.transportistaRepository.find({ relations: ['estado'] });

    for (const transportista of transportistas) {
      const nombreEstado = (transportista.estado?.nombre || '').toLowerCase();
      if (nombreEstado !== 'enespera') {
        transportista.estado = estadoEnEspera;
        await this.transportistaRepository.save(transportista);
      }
    }
  }

  async createTransportistaDesdeUsuario(dto: CreateTransportistaFromUserDto) {
    if (!dto?.idUsuario || !dto?.legajo) {
      throw new BadRequestException('Debe enviar idUsuario y legajo');
    }

    const existente = await this.transportistaRepository.findOne({
      where: { idUsuario: dto.idUsuario },
    });

    if (existente) {
      throw new BadRequestException('Ya existe un transportista para este usuario');
    }

    await this.asegurarEstadoEnEsperaParaTransportistas();
    const estado = await this.obtenerEstadoEnEspera();

    const nuevoTransportista = this.transportistaRepository.create({
      idUsuario: dto.idUsuario,
      legajo: dto.legajo,
      estado,
    });

    return this.transportistaRepository.save(nuevoTransportista);
  }



} 