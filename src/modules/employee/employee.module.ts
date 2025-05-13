import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { Employee, EmployeeSchema } from './schema/employee.schema';
import { EmployeeAttenndenceModule } from './attendence/attendence.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Employee.name, schema: EmployeeSchema }])],
  controllers: [EmployeeController],
  providers: [EmployeeService],
  exports: [EmployeeService, MongooseModule],
})

export class EmployeeModule {}
