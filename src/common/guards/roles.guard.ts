import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role, User } from 'src/modules/user/schema/user.schema';


@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.get<Role[]>('roles', context.getHandler());
        if (!requiredRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user: User = request.user;
        if (user.role === Role.Admin) return true
        return requiredRoles.includes(user.role)
    }
}
