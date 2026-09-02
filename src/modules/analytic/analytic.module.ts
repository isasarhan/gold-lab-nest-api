import { Module } from '@nestjs/common';
import { AnalyticController } from './analytic.controller';
import { AnalyticService } from './analytic.service';
import { CustomerModule } from '../customer/customer.module';
import { InvoiceModule } from '../invoice/invoice.module';
import { CustomerPaymentModule } from '../receipts/payment.module';
import { OrderModule } from '../order/order.module';

@Module({
  imports:[CustomerModule, InvoiceModule, CustomerPaymentModule, OrderModule],
  controllers: [AnalyticController],
  providers: [AnalyticService],
  exports: [AnalyticService],
})
export class AnalyticModule { }
