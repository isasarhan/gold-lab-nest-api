import { IsDate, IsEmail, IsMongoId, IsOptional } from "class-validator";
import { Pagination } from "src/common/types/filter";

export class GetPaymentsFilterDto extends Pagination{
    @IsMongoId()
    @IsOptional()
    customer:string    

    @IsDate()
    @IsOptional()
    startDate?: Date
    
    @IsDate()
    @IsOptional()
    endDate?: Date
}