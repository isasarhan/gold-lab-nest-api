  import { forwardRef, Module } from '@nestjs/common';
  import { CustomerController } from './customer.controller';
  import { CustomerService } from './customer.service';
  import { MongooseModule } from '@nestjs/mongoose';
  import { Customer, CustomerSchema } from './schema/customer.schema';
  import { BalanceModule } from '../balance/balance.module';

  @Module({
    imports: [forwardRef(() => BalanceModule), MongooseModule.forFeature([{ name: Customer.name, schema: CustomerSchema }])],
    controllers: [CustomerController],
    providers: [CustomerService],
    exports: [CustomerService],
  })
  export class CustomerModule { }
