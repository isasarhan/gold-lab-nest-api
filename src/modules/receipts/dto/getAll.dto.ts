import { Transform } from "class-transformer";
import { IsDate, IsEmail, IsMongoId, IsOptional } from "class-validator";
import { Pagination } from "src/common/types/filter";

export class GetPaymentsFilterDto extends Pagination{
    @IsMongoId()
    @IsOptional()
    customer:string    

    @IsDate()
    @Transform(({ value }) => new Date(value))
    @IsOptional()
    startDate?: Date
    
    @IsDate()
    @Transform(({ value }) => new Date(value))
    @IsOptional()
    endDate?: Date
}