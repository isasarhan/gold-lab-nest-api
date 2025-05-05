import { PartialType } from '@nestjs/mapped-types';
import { CreateBalanceDto } from './create.dto';

export class UpdateBalanceDto extends PartialType(CreateBalanceDto) {}
