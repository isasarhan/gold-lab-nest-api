import { IsDate, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { PaymentTypeEnum } from "../schema/salary-payment.schema";
import { Transform } from "class-transformer";
import { MonthEnum } from "src/utils/date-utilities";


export class CreateSalaryPaymentDto {
    @IsMongoId()
    @IsNotEmpty()
    employee: string

    @IsNotEmpty()
    @IsEnum(MonthEnum)
    month: MonthEnum;

    @IsString()
    @IsNotEmpty()
    year: string;

    @IsNumber()
    @IsNotEmpty()
    amount: number;
    
    @IsNotEmpty()
    @IsEnum(PaymentTypeEnum)
    type: PaymentTypeEnum;

    @IsOptional()
    @IsString()
    description: string

    @IsDate()
    @Transform(({ value }) => new Date(value))
    @IsNotEmpty()
    date: Date
}