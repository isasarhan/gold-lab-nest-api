import { PartialType } from '@nestjs/mapped-types';
import { CreateInventoryDto } from './create.dto';

export class UpdateInventoryDto extends PartialType(CreateInventoryDto) {}
