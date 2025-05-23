import { Transform, Type } from "class-transformer";
import { IsArray, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { Sector } from "../schema/daily-workflow.schema";
import { Karat } from "src/modules/order/schema/order.schema";

export class CreateReportDto {
    @IsEnum(Sector)
    @IsNotEmpty()
    from: Sector;

    @IsEnum(Sector)
    @IsNotEmpty()
    to: Sector;

    @IsEnum(Karat)
    @IsNotEmpty()
    karat: Karat;

    @IsNumber()
    @IsNotEmpty()
    weight: number

    @IsNumber()
    @IsOptional()
    quantity: number

    @IsOptional()
    @IsString()
    description?: string;
}

export class CreateDailyWorkflowDto {
    @IsDate()
    @Transform(({ value }) => new Date(value))
    @IsNotEmpty()
    date: Date

    @IsArray()
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateReportDto)
    reports: CreateReportDto[];
}