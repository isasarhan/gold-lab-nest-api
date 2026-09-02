import { Transform, Type } from 'class-transformer';
import { IsDate, IsInt, IsMongoId, IsOptional, Max, Min } from 'class-validator';

export class GetCustomerAnalyticsDto {
    @IsMongoId()
    @IsOptional()
    customerId?: string;

    @Type(() => Number)
    @IsInt()
    @IsOptional()
    year?: number;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(12)
    @IsOptional()
    month?: number;

    @IsDate()
    @Transform(({ value }) => new Date(value))
    @IsOptional()
    startDate?: Date;

    @IsDate()
    @Transform(({ value }) => new Date(value))
    @IsOptional()
    endDate?: Date;
}
