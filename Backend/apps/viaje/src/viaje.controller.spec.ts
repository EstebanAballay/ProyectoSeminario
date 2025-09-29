import { Test, TestingModule } from '@nestjs/testing';
import { ViajeService } from './viaje.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Viaje } from './entities/viaje.entity';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';

describe('ViajeService', () => {
  let service: ViajeService;
  let repo: Repository<Viaje>;
  let httpService: HttpService;

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
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ViajeService>(ViajeService);
    repo = module.get(getRepositoryToken(Viaje));
    httpService = module.get<HttpService>(HttpService);
  });

  it('debería crear un viaje con precio mockeado', async () => {
    const dto = { ruta: 'A-B' };

    // Mock del microservicio de precios
    jest.spyOn(httpService, 'get').mockReturnValue(
      of({ data: { precio: 100 } }) as any,
    );

    // Mock del repo
    jest.spyOn(repo, 'create').mockReturnValue({ ...dto, precio: 100 } as any);
    jest.spyOn(repo, 'save').mockResolvedValue({ id: 1, ...dto, precio: 100 } as any);

    const result = await service.createViaje(dto as any);

    expect(httpService.get).toHaveBeenCalledWith('http://precios-ms/precio/A-B');
    expect(repo.create).toHaveBeenCalledWith({ ruta: 'A-B', precio: 100 });
    expect(result).toEqual({ id: 1, ruta: 'A-B', precio: 100 });
  });
});
