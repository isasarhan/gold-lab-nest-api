import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeeAttendanceService } from './attendance.service';
import { EmployeeAttendanceController } from './attendance.controller';
import { EmployeeAttendance, EmployeeAttendanceSchema } from './schema/employee-attendance.schema';
import { EmployeeModule } from '../employee/employee.module';

@Module({
  imports: [EmployeeModule, MongooseModule.forFeature([{ name: EmployeeAttendance.name, schema: EmployeeAttendanceSchema }])],
  controllers: [EmployeeAttendanceController],
  providers: [EmployeeAttendanceService],
  exports: [EmployeeAttendanceService, MongooseModule],
})

export class EmployeeAttendanceModule {}
