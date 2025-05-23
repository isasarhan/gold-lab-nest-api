import { Module } from '@nestjs/common';
import { AnalyticController } from './analytic.controller';
import { AnalyticService } from './analytic.service';
import { CustomerModule } from '../customer/customer.module';
import { InvoiceModule } from '../invoice/invoice.module';
import { CustomerPaymentModule } from '../receipts/payment.module';

@Module({
  imports:[CustomerModule, InvoiceModule, CustomerPaymentModule],
  controllers: [AnalyticController],
  providers: [AnalyticService],
  exports: [AnalyticService],
})
export class AnalyticModule { }
