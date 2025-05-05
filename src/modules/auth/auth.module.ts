import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserModule } from "../user/user.module";
import { AuthControlller } from "./auth.controller";

@Module({
    imports: [UserModule],
    controllers: [AuthControlller],
    providers: [AuthService]
})

export class AuthModule {}
