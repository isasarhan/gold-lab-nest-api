import { IsEmail, IsMongoId, IsOptional } from "class-validator";

export class GetUsersFilterDto {
    @IsOptional()
    phone?: string

    @IsEmail()
    @IsOptional()
    email?: string
    
    @IsOptional()
    username?: string

    @IsOptional()
    searchTerm?: string
}