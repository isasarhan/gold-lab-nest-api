import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeeAttenndenceService } from './attendence.service';
import { EmployeeAttendenceController } from './attendence.controller';
import { EmployeeAttendence, EmployeeAttendenceSchema } from './schema/employee-attendence.schema';
import { EmployeeModule } from '../employee/employee.module';

@Module({
  imports: [EmployeeModule, MongooseModule.forFeature([{ name: EmployeeAttendence.name, schema: EmployeeAttendenceSchema }])],
  controllers: [EmployeeAttendenceController],
  providers: [EmployeeAttenndenceService],
  exports: [EmployeeAttenndenceService, MongooseModule],
})

export class EmployeeAttenndenceModule {}
