import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerPaymentDto } from './create.dto';

export class UpdateCustomerPaymentDto extends PartialType(CreateCustomerPaymentDto) {}
