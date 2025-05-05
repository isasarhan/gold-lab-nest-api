import { PartialType } from '@nestjs/mapped-types';
import { CreateInvoiceDto } from './create.dto';

export class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) {}
