import {
    IsArray,
    IsDateString,
    IsMongoId,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
  } from 'class-validator';
import { Types } from 'mongoose';
import { CreateOrderDto } from 'src/modules/order/dto/create.dto';
  
  export class CreateInvoiceDto {
    @IsOptional()
    @IsString()
    invoiceNb?: string;
  
    @IsMongoId()
    customer: Types.ObjectId;
  
    @IsArray()
    @IsNotEmpty()
    orders: CreateOrderDto[];
  
    @IsOptional()
    @IsNumber()
    totalWeight?: number;
  
    @IsOptional()
    @IsNumber()
    totalCash?: number;
  
    @IsOptional()
    @IsDateString()
    date?: Date;
  }
  