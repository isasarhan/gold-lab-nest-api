import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeeModule } from './modules/employee/employee.module';
import { SettingModule } from './modules/setting/setting.module';
import { SupplyModule } from './modules/supply/supply.module';
import { SupplierModule } from './modules/supplier/supplier.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { CustomerPaymentModule } from './modules/receipts/payment.module';
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
import { AuthMiddleware } from './common/middlewares/auth.middleware';
import { DailyWorkflowModule } from './modules/daily-workflow/daily-workflow.module';
import { EmployeeAttenndenceModule } from './modules/attendence/attendence.module';
import { SalaryPaymentModule } from './modules/salary-payment/salary-payment.module';

@Module({
  imports:
    [ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}.local`,
      load: [configuration],
    }),
    MongooseModule.forRoot(`${process.env.DATABASE_HOST}`),
      AuthModule,  SalaryPaymentModule,EmployeeAttenndenceModule, UserModule, UserModule, CustomerModule, BalanceModule, AnalyticModule, OrderModule,
      SupplyPaymentModule, InvoiceModule, InventoryModule, SupplierModule, SupplyModule, SettingModule, EmployeeModule, CustomerPaymentModule, DailyWorkflowModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'auth', method: RequestMethod.ALL },
        { path: 'auth/(.*)', method: RequestMethod.ALL }
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}