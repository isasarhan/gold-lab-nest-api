import { Module } from '@nestjs/common';
import { AnalyticController } from './analytic.controller';
import { AnalyticService } from './analytic.service';
import { CustomerModule } from '../customer/customer.module';
import { InvoiceModule } from '../customer/invoice/invoice.module';
import { CustomerPaymentModule } from '../customer/payment/payment.module';

@Module({
  imports:[CustomerModule, InvoiceModule, CustomerPaymentModule],
  controllers: [AnalyticController],
  providers: [AnalyticService],
  exports: [AnalyticService],
})
export class AnalyticModule { }
