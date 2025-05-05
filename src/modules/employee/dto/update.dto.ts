import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeDto } from './create.dto';

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {}
