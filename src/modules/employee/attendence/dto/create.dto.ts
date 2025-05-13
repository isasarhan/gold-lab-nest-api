import { IsOptional, IsString, IsNumber, IsEmail, IsNotEmpty, IsMongoId, IsDate } from 'class-validator';

export class CreateEmployeeAttendenceDto {
  @IsNotEmpty()
  @IsMongoId()
  employee: string;
  
  @IsDate()
  @IsNotEmpty()
  arrival: Date;
  
  @IsDate()
  @IsNotEmpty()
  departure: Date
}
