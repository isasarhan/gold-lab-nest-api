import { Module } from '@nestjs/common';
import { SalaryPaymentService } from './salary-payment.service';
import { SalaryPaymentController } from './salary-payment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SalaryReport, SalaryReportSchema } from './schema/salary-payment.schema';
import { EmployeeModule } from '../employee/employee.module';

@Module({
  imports: [EmployeeModule, MongooseModule.forFeature([{ name: SalaryReport.name, schema: SalaryReportSchema }])],
  providers: [SalaryPaymentService],
  controllers: [SalaryPaymentController],
})
export class SalaryPaymentModule { }
