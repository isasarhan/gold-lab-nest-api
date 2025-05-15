import { Types } from 'mongoose';
import { IsArray, IsDateString, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateInvoiceDto {

    @IsOptional()
    @IsString()
    invoiceNb?: string;

    @IsNotEmpty()
    @IsMongoId()
    @IsOptional()
    customer?: Types.ObjectId;
    
    @IsOptional()
    @IsNumber()
    totalWeight?: number;
    
    @IsOptional()
    @IsNumber()
    totalCash?: number;
    
    @IsNotEmpty()
    @IsDateString()
    @IsOptional()
    date?: Date;

    @IsArray()
    @IsOptional()
    orders?: Types.ObjectId[];
}
