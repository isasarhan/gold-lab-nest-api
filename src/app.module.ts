import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeeModule } from './modules/employee/employee.module';
import { SettingModule } from './modules/setting/setting.module';
import { SupplyModule } from './modules/supply/supply.module';
import { SupplierModule } from './modules/supplier/supplier.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { InvoiceModule } from './modules/customer/invoice/invoice.module';
import { CustomerPaymentModule } from './modules/customer/payment/payment.module';
import { SupplyPaymentModule } from './modules/supply/supply-payment/supply-payment.module';
import { OrderModule } from './modules/order/order.module';
import { AnalyticModule } from './modules/analytic/analytic.module';
import { BalanceModule } from './modules/balance/balance.module';
import { CustomerModule } from './modules/customer/customer.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { EmployeeAttenndenceModule } from './modules/employee/attendence/attendence.module';

@Module({
  imports:
    [ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}.local`,
      load: [configuration],
    }),
    MongooseModule.forRoot(`${process.env.DATABASE_HOST}`),
      AuthModule, EmployeeAttenndenceModule, UserModule, UserModule, CustomerModule, BalanceModule, AnalyticModule, OrderModule,
      SupplyPaymentModule, InvoiceModule, InventoryModule, SupplierModule, SupplyModule, SettingModule, EmployeeModule, CustomerPaymentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
