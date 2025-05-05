import { IsNumber, IsString } from 'class-validator';

export class CreateInventoryDto {
  @IsString()
  name: string;

  @IsNumber()
  weight: number;

  @IsNumber()
  cash: number;
}
