import {
    IsArray,
    IsDateString,
    IsMongoId,
    IsNumber,
    IsOptional,
    IsString,
  } from 'class-validator';
  
  export class CreateInvoiceDto {
    @IsOptional()
    @IsString()
    invoiceNb?: string;
  
    @IsMongoId()
    customer: string;
  
    @IsArray()
    @IsMongoId({ each: true })
    orders: string[];
  
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
  