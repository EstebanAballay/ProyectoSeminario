import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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

@Injectable()
export class UnidadService {

  constructor(private readonly httpService: HttpService,
    @InjectRepository(Semirremolque) private semirremolqueRepository: Repository<Semirremolque>,
    @InjectRepository(Acoplado) private acopladoRepository: Repository<Acoplado>,
    @InjectRepository(Tipo) private tipoRepository: Repository<Tipo>,
    @InjectRepository(TipoCamion) private tipoCamionRepository: Repository<TipoCamion>,
    @InjectRepository(Camion) private CamionRepository: Repository<Camion>,
    @InjectRepository(Unidad) private UnidadRepository: Repository<Unidad>
  ) {}

  async testConnection() 
        {try {
          const count = await this.UnidadRepository.count();
          console.log('DB connection works, Unidad count:', count);
          } 
         catch (error){
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


  /*
  async createUnidad(createUnidadDto: CreateUnidadDto) {
    let Semirremolque: any = null;
    let Camion: any = null;
    let Acoplado: any = null;

    //Seleccionar un semiremolque random que cumpla con el tipo
    if (createUnidadDto.tipoCamion == 'tractoCamion'){
      //buscar los camiones del tipo tractocamion y seleccionar uno random
      Camion = this.getRandomItem(await this.CamionRepository.find({where: {tipoCamion: {id: 1}}}));

      //busco el tipo por su nombre
      const tipoSemi = await this.tipoRepository.findOne({ where: { nombre: createUnidadDto.tipoSemirremolque } });
      if (!tipoSemi){
        throw new NotFoundException('No se encontro el tipo de semiremolque');
      }
      if (createUnidadDto.semiremolque == true){
        //busco el semi por su tipo que encontre antes
        const semirremolques = await this.semirremolqueRepository.find({ where: { tipo: tipoSemi }});
        
        if (!semirremolques){
          throw new NotFoundException('No se encontro ninguna unidad de este tipo')
        }
        //selecciono un semirremolque random
        Semirremolque = this.getRandomItem(semirremolques);
      }
      else{
        throw new NotFoundException('Debe seleccionar un semirremolque si selecciona un tractocamion')
      }
    }    //Si no es un tractocamion, debo encontrar un tipo de camion entero adecuado
    else{
      //Busco el tipo de camion por su nombre
      const tipoCamion = await this.tipoCamionRepository.findOne({where: {nombre: createUnidadDto.tipoCamion}})
      if (!tipoCamion){
        throw new NotFoundException('No se encontro un tipo de camion entero con ese nombre')
      }
      const camionesEnteros = await this.CamionRepository.find({where: {tipoCamion: tipoCamion }})
      if (!camionesEnteros){
        throw new NotFoundException('No se encontro ningun camion entero de este tipo')
      }   
      Camion = this.getRandomItem(camionesEnteros);
    }

    //Seleccionar un acoplado random que cumpla con el tipo
    if (createUnidadDto.acoplado == true){
      const acoplados = await this.acopladoRepository.find();
      if (!acoplados){
        throw new NotFoundException('No se encontro ningun acoplado de este tipo')
      }
      Acoplado = this.getRandomItem(acoplados);
    }
    //Consultar el precio de los detalles y calcular subtotal
    const subtotal = Semirremolque?.precio + Camion?.precio + Acoplado?.precio;
    //Consultar carga
    const cargaTotal = Camion?.peso + Semirremolque?.capacidad + Acoplado?.capacidad;
    //Crear y guardar la unidad
    console.log(createUnidadDto.viajeId)
    const unidadNueva = this.UnidadRepository.create({
      idViaje: createUnidadDto.viajeId,
      camion: Camion,
      semiremolque: Semirremolque,
      acoplado: Acoplado,
      subtotal: subtotal
    });
    return this.UnidadRepository.save(unidadNueva);
  }
  */
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

    const subtotal = semirremolque?.precio + camion?.precio + acoplado?.precio;
    // Crear la unidad
    const unidad = this.UnidadRepository.create({
      idViaje: dto.viajeId,
      camion:camion,
      semiremolque: semirremolque || null,
      acoplado: acoplado || null,
      subtotal:subtotal
    });

    // Guardar
    return this.UnidadRepository.save(unidad);
  }
  
  consultarTiposAcoplados(): Promise<Tipo[]> {
    return this.tipoRepository.find();
  }

  consultarTiposCamiones(): Promise<TipoCamion[]> {
    return this.tipoCamionRepository.find();
  }

  //Busca las unidades disponibles
  async findDisponibles(unidadesOcupadas: number[]): Promise<{
    camiones: Camion[];
    acoplados:any;
    semirremolques: any;}> 
    {
      const unidades = await this.UnidadRepository.find({
        where: { UnidadId: In(unidadesOcupadas) },
        relations: ['camion', 'acoplado', 'semiremolque'],
      });

      const camionesOcupados = unidades.map(u => u.camion?.id).filter(Boolean);
      const acopladosOcupados = unidades.map(u => u.acoplado?.id).filter(Boolean);
      const semirremolquesOcupados = unidades.map(u => u.semiremolque?.id).filter(Boolean);

      const camionesDisponibles =( await this.CamionRepository.find({
        where: { id: Not(In(camionesOcupados))},
      })).map(c => ({ ...c, tipo: c.tipoCamion.nombre }));;

      const acopladosDisponibles = (await this.acopladoRepository.find({
        where: { id: Not(In(acopladosOcupados))},
      })).map(c => ({ ...c, tipo: c.tipo.nombre }));;

      const semirremolquesDisponibles = (await this.semirremolqueRepository.find({
        where: { id: Not(In(semirremolquesOcupados))},
      })).map(c => ({ ...c, tipo: c.tipo.nombre }));;

      return {
        camiones: camionesDisponibles,
        acoplados: acopladosDisponibles,
        semirremolques: semirremolquesDisponibles,
      };
    }
  
  findUnidadesDisponiblesByTipoRandom(camionesPedidos: any[],unidadesDisponibles: any): {
    unidadesFormadas: any[]; errores: string[];} {
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
    return { unidadesFormadas: [], errores: ['camionesPedidos no está definido o no es un array']};
  }
  
    for (const [index, pedido] of camionesPedidos.entries()) {
      const { tipo, semirremolque, acoplado } = pedido;
      console.log('El tipo del camion pedido es',tipo);

      // --- Buscar camiones disponibles del tipo pedido ---
      const camionesDisponibles = camiones.filter(c => c.tipoCamion.nombre === tipo && !usadosCamiones.has(c.id));
      const camion = elegirRandom(camionesDisponibles) as Camion || undefined;
      console.log('el camion es:',camion);
      if (!camion) {
        errores.push(`No se encontró camión disponible del tipo "${tipo}" (pedido ${index + 1}).`);
        continue;
      }
      usadosCamiones.add(camion.id);

      // --- Buscar semirremolques disponibles ---
      let semi = null;
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

      // --- Buscar acoplado (si aplica) ---
      let acopladoEncontrado = null;

      if (acoplado && acoplado.trim().toLowerCase() !== 'sin acoplado') {
        const tipoAcoplado = String(acoplado).trim().toLowerCase();

        //busco acoplados por el tipo y que no hayan sido usados,de entre los disponibles
        const acopladosDisponibles = acoplados.filter(a =>
          a.tipo.trim().toLowerCase() === tipoAcoplado && !usadosAcoplados.has(a.id)
        );

        console.log('los usados son: ',usadosAcoplados);
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
      unidadesFormadas.push({
        camion: camion,
        semirremolque: semi,
        acoplado: acopladoEncontrado,
        cargaTotal: cargaTotal,
        subtotal: subtotal
      });
    }
    console.log('Unidades formadas:', unidadesFormadas);
    return { unidadesFormadas, errores};
}


  findAll() {
    return `This action returns all unidad`;
  }

  findOne(id: number) {
    return `This action returns a #${id} unidad`;
  }

  update(id: number, updateUnidadDto: UpdateUnidadDto) {
    return `This action updates a #${id} unidad`;
  }

  remove(id: number) {
    return `This action removes a #${id} unidad`;
  }
}
