import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SupplyPaymentService } from './supply-payment.service';
import { SupplyPaymentController } from './supply-payment.controller';
import { SupplyPayment, SupplyPaymentSchema } from './schema/supply-payment.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: SupplyPayment.name, schema: SupplyPaymentSchema }])],
  controllers: [SupplyPaymentController],
  providers: [SupplyPaymentService],
  exports: [SupplyPaymentService, MongooseModule],
})

export class SupplyPaymentModule {}
