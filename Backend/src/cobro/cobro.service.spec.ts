import { Test, TestingModule } from '@nestjs/testing';
import { CobroService } from './cobro.service';

describe('CobroService', () => {
  let service: CobroService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CobroService],
    }).compile();

    service = module.get<CobroService>(CobroService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
