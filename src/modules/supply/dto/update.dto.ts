import { PartialType } from '@nestjs/mapped-types';
import { CreateSupplyDto } from './create.dto';

export class UpdateSupplyDto extends PartialType(CreateSupplyDto) {}
