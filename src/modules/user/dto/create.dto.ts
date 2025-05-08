import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { Role } from '../schema/user.schema';

export class CreateUserDto {
    @IsNotEmpty()
    username: string;

    @IsOptional()
    firstName: string;

    @IsOptional()
    lastName: string;
    
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsOptional()
    phone?: string;

    @IsOptional()
    isSuperAdmin?: boolean;

    @IsOptional()
    profileUrl?: string

    @IsEnum(Role)
    @IsOptional()
    role?: Role;

    @IsOptional()
    @IsBoolean()
    isApproved?: boolean;
}
