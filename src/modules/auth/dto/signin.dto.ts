import { IsEmail, IsNotEmpty, IsOptional, MinLength } from "class-validator";

export class SignInDto {
    @IsOptional()
    username: string;
    
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;

}