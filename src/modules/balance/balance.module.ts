import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BalanceService } from './balance.service';
import { BalanceController } from './balance.controller';
import { Balance, BalanceSchema } from './schema/balance.schema';
import { CustomerModule } from '../customer/customer.module';

@Module({
  imports: [forwardRef(() => CustomerModule), MongooseModule.forFeature([{ name: Balance.name, schema: BalanceSchema }])],
  controllers: [BalanceController],
  providers: [BalanceService],
  exports: [BalanceService, MongooseModule],
})

export class BalanceModule {}
