import { PartialType } from '@nestjs/mapped-types';
import { CreateSupplierDto } from './create.dto';

export class UpdateSupplierDto extends PartialType(CreateSupplierDto) {}
