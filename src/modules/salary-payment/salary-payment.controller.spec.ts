import { Test, TestingModule } from '@nestjs/testing';
import { SalaryPaymentController } from './salary-payment.controller';

describe('SalaryPaymentController', () => {
  let controller: SalaryPaymentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalaryPaymentController],
    }).compile();

    controller = module.get<SalaryPaymentController>(SalaryPaymentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
