import { IsMongoId, IsNumber } from 'class-validator';

export class CreateBalanceDto {
  @IsMongoId()
  customer: string;

  @IsNumber()
  gold: number;

  @IsNumber()
  cash: number;
}
