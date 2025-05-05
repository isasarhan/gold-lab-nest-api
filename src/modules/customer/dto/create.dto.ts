import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { CustomerType } from '../schema/customer.schema';

export class CreateCustomerDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsEnum(CustomerType)
  type?: CustomerType;
}
