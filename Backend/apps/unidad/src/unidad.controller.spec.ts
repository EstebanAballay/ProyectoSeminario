import { Test, TestingModule } from '@nestjs/testing';
import { UnidadController } from './unidad.controller';
import { UnidadService } from './unidad.service';

describe('UnidadController', () => {
  let controller: UnidadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnidadController],
      providers: [UnidadService],
    }).compile();

    controller = module.get<UnidadController>(UnidadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
