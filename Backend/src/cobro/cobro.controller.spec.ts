import { Test, TestingModule } from '@nestjs/testing';
import { CobroController } from './cobro.controller';

describe('CobroController', () => {
  let controller: CobroController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CobroController],
    }).compile();

    controller = module.get<CobroController>(CobroController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
