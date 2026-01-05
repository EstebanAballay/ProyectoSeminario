import { Test, TestingModule } from '@nestjs/testing';
import { MapsController } from './maps.controller';
import { MapsService } from './maps.service';

describe('MapsController', () => {
  let mapsController: MapsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MapsController],
      providers: [MapsService],
    }).compile();

    mapsController = app.get<MapsController>(MapsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(mapsController.getHello()).toBe('Hello World!');
    });
  });
});
