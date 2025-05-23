import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order, OrderSchema } from './schema/order.schema';
import { InvoiceModule } from '../invoice/invoice.module';

@Module({
  imports: [forwardRef(() =>InvoiceModule), MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }])],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService, MongooseModule],
})

export class OrderModule {}
