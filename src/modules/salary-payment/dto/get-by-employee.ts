import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class GetByEmployeeArgs {
    @IsString()
    @IsOptional()
    month:string

    @IsString()
    @IsNotEmpty()
    year:string
}