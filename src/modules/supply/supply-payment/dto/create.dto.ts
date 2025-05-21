import {
    IsMongoId,
    IsOptional,
    IsString,
    IsNumber,
    IsDateString,
    IsNotEmpty,
    IsEnum,
  } from 'class-validator';
import { Currency } from 'src/common/types/enums';
import { Karat } from 'src/modules/order/schema/order.schema';
  
  export class CreateSupplyPaymentDto {
    @IsMongoId()
    supplier: string;
  
    @IsOptional()
    @IsString()
    invoiceNb?: string;
  
    @IsOptional()
    @IsDateString()
    date?: Date;
  
    @IsOptional()
    @IsNumber()
    weight?: number;
  
    @IsOptional()
    @IsNumber()
    karat?: number;
  
    @IsOptional()
    @IsNumber()
    cash?: number;
  
    @IsEnum(Currency)
    @IsOptional()
    currency?: Currency;
  
    @IsOptional()
    @IsString()
    description?: string;
  }
  