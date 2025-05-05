import { Test, TestingModule } from '@nestjs/testing';
import { SupplyPaymentController } from './supply-payment.controller';

describe('PaymentController', () => {
  let controller: SupplyPaymentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupplyPaymentController],
    }).compile();

    controller = module.get<SupplyPaymentController>(SupplyPaymentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
