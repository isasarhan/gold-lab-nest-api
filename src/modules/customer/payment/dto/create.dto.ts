import {
    IsMongoId,
    IsOptional,
    IsString,
    IsNumber,
    IsDateString,
  } from 'class-validator';
  
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
  
    @IsOptional()
    @IsString()
    currency?: string;
  
    @IsOptional()
    @IsString()
    description?: string;
  }
  