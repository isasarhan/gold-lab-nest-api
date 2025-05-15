import { forwardRef, Module } from '@nestjs/common';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Invoice, InvoiceSchema } from './schema/invoice.schema';
import { OrderModule } from 'src/modules/order/order.module';
import { BalanceModule } from 'src/modules/balance/balance.module';

@Module({
  imports: [forwardRef(() =>OrderModule),BalanceModule, MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }])],
  controllers: [InvoiceController],
  providers: [InvoiceService],
  exports: [InvoiceService],
})
export class InvoiceModule { }
