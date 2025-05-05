import { IsDate, IsEmail, IsMongoId, IsOptional } from "class-validator";

export class GetPaymentsFilterDto {
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