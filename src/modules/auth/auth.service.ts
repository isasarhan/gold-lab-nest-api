import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common"
import * as jwt from 'jsonwebtoken'
import { CreateUserDto } from "../user/dto/create.dto"
import { UserService } from "../user/user.service"

@Injectable()
export class AuthService {
    constructor(private usersService: UserService) { }

    async register(userDto: CreateUserDto) {
        return await this.usersService.create(userDto)
    }

    async signIn(email: string, password: string) {
        const user = await this.usersService.findByEmail(email)
        if (!user) {
            throw new NotFoundException('User not found')
        }

        const isPasswordValid = await user.matchPassword(password)

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials')
        }

        const token = this.generateJwtToken(user._id.toString())

        return { token , user}
    }

    private generateJwtToken(userId: string): string {
        const payload = { userId }
        const secret = process.env.JWT_SECRET
        if (!secret) throw new Error('JWT_SECRET environment variable is not configured')
        return jwt.sign(payload, secret, { expiresIn: '1d' })
    }
}
