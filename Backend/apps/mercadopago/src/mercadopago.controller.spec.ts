import { Test, TestingModule } from '@nestjs/testing';
import { MercadopagoController } from './mercadopago.controller';
import { MercadopagoService } from './mercadopago.service';

describe('MercadopagoController', () => {
  let mercadopagoController: MercadopagoController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MercadopagoController],
      providers: [MercadopagoService],
    }).compile();

    mercadopagoController = app.get<MercadopagoController>(MercadopagoController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(mercadopagoController.getHello()).toBe('Hello World!');
    });
  });
});
