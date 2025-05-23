import {
    IsMongoId,
    IsOptional,
    IsString,
    IsNumber,
    IsDateString,
    IsEnum,
  } from 'class-validator';
import { Currency } from 'src/common/types/enums';
  
  export class CreateCustomerPaymentDto {
    @IsMongoId()
    customer: string;
  
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
  