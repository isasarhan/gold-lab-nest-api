import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignInDto } from "./dto/signin.dto";
import { CreateUserDto } from "../user/dto/create.dto";

@Controller('auth')
export class AuthControlller {
    constructor(private authService: AuthService) { }

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        return await this.authService.register(createUserDto);
    }

    @Post('login')
    async signIn(@Body() signInDto: SignInDto) {
        console.log('signInDto', signInDto);
        
        return this.authService.signIn(signInDto.email, signInDto.password)
    }
}