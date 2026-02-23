import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeAttendanceDto } from './create.dto';

export class UpdateEmployeeAttendanceDto extends PartialType(CreateEmployeeAttendanceDto) {}
