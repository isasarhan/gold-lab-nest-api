import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';
import { CreateOrderDto } from 'src/modules/order/dto/create.dto';

export class CreateInvoiceDto {
  @IsOptional()
  @IsString()
  invoiceNb?: string;

  @IsNotEmpty()
  @IsMongoId()
  customer: Types.ObjectId;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderDto)
  orders: CreateOrderDto[];

  @IsOptional()
  @IsNumber()
  totalWeight?: number;

  @IsOptional()
  @IsNumber()
  totalCash?: number;

  @IsNotEmpty()
  @IsDateString()
  date?: Date;
}
