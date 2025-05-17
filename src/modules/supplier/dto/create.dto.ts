import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSupplierDto {
    @IsNotEmpty()
    name: string;
    
    @IsNumber()
    @IsOptional()
    gold: number;
    
    @IsNumber()
    @IsOptional()
    silver: number;
    
    @IsNumber()
    @IsOptional()
    cash: number;

    @IsOptional()
    phone?: string;
    
    @IsOptional()
    description?: string;
}
