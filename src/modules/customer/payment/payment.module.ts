import { Module } from '@nestjs/common';
import { CustomerPaymentController } from './payment.controller';
import { CustomerPaymentService } from './payment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './schema/customer-payment.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }])],
  controllers: [CustomerPaymentController],
  providers: [CustomerPaymentService],
  exports: [CustomerPaymentService],
})
export class InvoiceModule { }
