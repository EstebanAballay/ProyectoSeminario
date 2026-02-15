import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ViajeService } from './viaje.service';
import { Viaje } from './entities/viaje.entity';
import { EstadoViaje } from './entities/estadoViaje.entity';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';

describe('ViajeService - createViaje', () => {
  //Aca debo incluir las entidades que necesito, o que debo mockear
  let service: ViajeService;
  let viajeRepo: Repository<Viaje>;
  let estadoRepo: Repository<EstadoViaje>;

  //module es el modulo de testing que estamos creando,debe incluir las entidades de arriba
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ViajeService,
        {
          provide: getRepositoryToken(Viaje),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(EstadoViaje),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: HttpService,   // 👈 agregamos este mock
          useValue: {},           // lo dejamos vacío porque no lo usamos en este test
        }
      ],
    }).compile();
    //Incluimos un pedacito del modulo de testing en donde corresponda,con esto ya tenemos listo el modulo de testing
    service = module.get<ViajeService>(ViajeService);
    viajeRepo = module.get(getRepositoryToken(Viaje));
    estadoRepo = module.get(getRepositoryToken(EstadoViaje));

    // Estas son respuestas que debe recibir mi funcionalidad a testear para poder ejecutarse
    //esta hecho asi para que no haga la peticion al otro microservicio,porque de cualquier manera no me devuelve nada
    jest.spyOn(service as any, 'agregarUnidad').mockImplementation(() => {});
  });

  it('debería crear un viaje con los datos esperados', async () => {
    // dto de entrada
    const dto = {
      fechaInicio: '2025-10-15',
      destinoInicio: 51651654651,
      destinoFin: 64563465465,
      horaSalida: '14:32:00',
      fechaFin: '2025-10-16',
      horaLlegada: '23:51:00',
      unidades: [
        {
          camionId: 152,
          transportistaId: 14,
          semiremolqueId: 'ABC 123',
          acopladoId: 'ZXC 497',
          tipo: 'frigorifico',
        },
      ],
    };

    // Estado default mockeado, pido que me devuelva este estado falso
    jest
      .spyOn(estadoRepo, 'findOne')
      .mockResolvedValue({ id: 99, nombre: 'creado' } as EstadoViaje);

    // Mock del viajeRepo.create,simulo crear
    jest.spyOn(viajeRepo, 'create').mockImplementation((data: any) => ({
      ...data,
      ViajeId: 2, // simular id generado
    }));

    // Mock del viajeRepo.save, simulo guardar en bd
    jest
      .spyOn(viajeRepo, 'save')
      .mockImplementation(async (viaje: any) => viaje);

    // Act: llamamos al método real
    const result = await service.createViaje(dto as any);

    // Assert: compara con el resultado esperado
    expect(result).toEqual({
      fechaReserva: expect.any(Date), 
      fechaInicio: new Date('2025-10-15'),
      fechaFin: new Date('2025-10-16'),
      destinoInicio: 51651654651,
      destinoFin: 64563465465,
      horaSalida: '14:32:00',
      horaLlegada: '23:51:00',
      sena: 0,
      resto: 0,
      total: 0,
      estadoViaje: { id: 99, nombre: 'creado' },
      ViajeId: 2,
    });

    // Asegurarnos que se llamó a los repositorios
    expect(estadoRepo.findOne).toHaveBeenCalledWith({
      where: { nombre: 'PreCargado' },
    });
    expect(viajeRepo.create).toHaveBeenCalled();
    expect(viajeRepo.save).toHaveBeenCalled();
  });
});
