import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BalanceService } from './balance.service';
import { BalanceController } from './balance.controller';
import { Balance, BalanceSchema } from './schema/balance.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Balance.name, schema: BalanceSchema }])],
  controllers: [BalanceController],
  providers: [BalanceService],
  exports: [BalanceService, MongooseModule],
})

export class BalanceModule {}
