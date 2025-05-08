import { IsMongoId, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateBalanceDto {
  @IsMongoId()
  @IsNotEmpty()
  customer: string;

  @IsOptional()
  @IsNumber()
  gold?: number;
  
  @IsOptional()
  @IsNumber()
  cash?: number;
}
