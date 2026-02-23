import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, IsEmail, IsNotEmpty, IsMongoId, IsDate } from 'class-validator';

export class CreateEmployeeAttendanceDto {
  @IsNotEmpty()
  @IsMongoId()
  employee: string;
  
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  arrival?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  departure?: Date;
}
