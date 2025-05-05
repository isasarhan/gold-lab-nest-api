import { IsEnum, IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';
import { ItemType, Karat } from '../schema/order.schema';

export class CreateOrderDto {
  @IsMongoId()
  customer: string;

  @IsNumber()
  weight: number;

  @IsEnum(Karat)
  karat: Karat;

  @IsNumber()
  perGram: number;

  @IsNumber()
  perItem: number;

  @IsOptional()
  @IsString()
  invoiceNb?: string;

  @IsEnum(ItemType)
  type: ItemType;

  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  date?: Date;
}
