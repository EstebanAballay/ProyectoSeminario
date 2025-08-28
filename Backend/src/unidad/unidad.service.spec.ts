import { Test, TestingModule } from '@nestjs/testing';
import { UnidadService } from './unidad.service';

describe('UnidadService', () => {
  let service: UnidadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnidadService],
    }).compile();

    service = module.get<UnidadService>(UnidadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
