import { Test, TestingModule } from '@nestjs/testing';
import { CustomerPaymentService } from './payment.service';

describe('CustomerPaymentService', () => {
  let service: CustomerPaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerPaymentService],
    }).compile();

    service = module.get<CustomerPaymentService>(CustomerPaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
