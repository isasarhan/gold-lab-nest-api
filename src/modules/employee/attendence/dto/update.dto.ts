import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeAttendenceDto } from './create.dto';

export class UpdateEmployeeAttendenceDto extends PartialType(CreateEmployeeAttendenceDto) {}
