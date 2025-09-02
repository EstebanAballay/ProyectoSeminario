import { Test, TestingModule } from '@nestjs/testing';
import { ViajeService } from './viaje.service';

describe('ViajeService', () => {
  let service: ViajeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ViajeService],
    }).compile();

    service = module.get<ViajeService>(ViajeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
