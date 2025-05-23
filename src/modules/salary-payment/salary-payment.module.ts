import { Module } from '@nestjs/common';
import { SalaryPaymentService } from './salary-payment.service';
import { SalaryPaymentController } from './salary-payment.controller';

@Module({
  providers: [SalaryPaymentService],
  controllers: [SalaryPaymentController]
})
export class SalaryPaymentModule {}
