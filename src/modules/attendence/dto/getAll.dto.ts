import { Transform } from "class-transformer";
import { IsDate, IsEmail, IsMongoId, IsOptional } from "class-validator";
import { Pagination } from "src/common/types/filter";

export class GetAttendenceFilterDto extends Pagination {
    @IsMongoId()
    @IsOptional()
    employee?: string

    @IsDate()
    @Transform(({ value }) => new Date(value))
    @IsOptional()
    startDate?: Date
    
    @IsDate()
    @Transform(({ value }) => new Date(value))
    @IsOptional()
    endDate?: Date

    @IsOptional()
    month?: number
    
    @IsOptional()
    year?: number
}