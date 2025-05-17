import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SupplyService } from './supply.service';
import { SupplyController } from './supply.controller';
import { Supply, SupplySchema } from './schema/supply.schema';
import { SupplierModule } from '../supplier/supplier.module';

@Module({
  imports: [SupplierModule, MongooseModule.forFeature([{ name: Supply.name, schema: SupplySchema }])],
  controllers: [SupplyController],
  providers: [SupplyService],
  exports: [SupplyService, MongooseModule],
})

export class SupplyModule {}
