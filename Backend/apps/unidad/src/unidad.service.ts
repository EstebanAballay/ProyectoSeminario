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


  
  async createUnidad(createUnidadDto: CreateUnidadDto) {
    let Semirremolque: any = null;
    let Camion: any = null;
    let Acoplado: any = null;
    console.log("llegue afuera del if")
    //Seleccionar un semiremolque random que cumpla con el tipo
    if (createUnidadDto.tipoCamion == 'tractoCamion'){
      console.log("llegue adentro del if")
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
    const cargaTotal = Semirremolque.capacidad + Acoplado.capacidad;
    //Crear y guardar la unidad
    const unidadNueva = this.UnidadRepository.create({
      idViaje: createUnidadDto.viajeId,
      Camion: Camion,
      semiremolque: Semirremolque,
      acoplado: Acoplado,
      subtotal: subtotal
    });
    return this.UnidadRepository.save(unidadNueva);
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
