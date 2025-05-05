import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { SettingModule } from './modules/setting/setting.module';
import { PaymentModule } from './modules/payment/payment.module';
import { SupplyModule } from './modules/supply/supply.module';
import { SupplierModule } from './modules/supplier/supplier.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { PaymentModule } from './modules/payment/payment.module';
import { OrderModule } from './modules/order/order.module';
import { AnalyticModule } from './modules/analytic/analytic.module';
import { BalanceModule } from './modules/balance/balance.module';
import { CustomerModule } from './modules/customer/customer.module';
import { UserModule } from './modules/user/user.module';
import { UsersModule } from './modules/users/users.module';
import { CustomersModule } from './modules/customers/customers.module';
import { AuthModule } from './nest/modules/auth/auth.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [AuthModule, CustomersModule, UsersModule, UserModule, CustomerModule, BalanceModule, AnalyticModule, OrderModule, PaymentModule, InvoiceModule, InventoryModule, SupplierModule, SupplyModule, SettingModule, EmployeeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
