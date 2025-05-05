import { Test, TestingModule } from '@nestjs/testing';
import { SupplyPaymentService } from './supply-payment.service';

describe('SupplyPaymentService', () => {
  let service: SupplyPaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupplyPaymentService],
    }).compile();

    service = module.get<SupplyPaymentService>(SupplyPaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
