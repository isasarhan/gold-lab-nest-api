import { IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ItemType, Karat } from 'src/modules/order/schema/order.schema';

export class CreateSupplyDto {
    @IsMongoId()
    supplier: string;

    @IsNumber()
    weight: number;
    
    @IsString()
    invoiceNb: string;

    @IsEnum(Karat)
    @IsOptional()
    karat: Karat;

    @IsNumber()
    perGram: number;

    @IsOptional()
    @IsString()
    description?: string;

    @IsEnum(ItemType)
    type: ItemType;
}
