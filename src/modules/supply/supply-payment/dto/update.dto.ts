import { PartialType } from '@nestjs/mapped-types';
import { CreateSupplyPaymentDto } from './create.dto';

export class UpdateSupplyPaymentDto extends PartialType(CreateSupplyPaymentDto) {}
