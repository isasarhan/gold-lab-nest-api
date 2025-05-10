import { IsEmail, IsMongoId, IsOptional } from "class-validator";
import { Pagination } from "src/common/types/filter";

export class GetUsersFilterDto extends Pagination{
    @IsOptional()
    phone?: string

    @IsEmail()
    @IsOptional()
    email?: string
    
    @IsOptional()
    username?: string

}