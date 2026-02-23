import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role, User } from 'src/modules/user/schema/user.schema';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Step 1: @Public() routes bypass all role checks
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    // Step 2: Must have an authenticated user (set by AuthMiddleware)
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    if (!user) return false;

    // Step 3: isSuperAdmin bypasses all role checks
    if (user.isSuperAdmin) return true;

    // Step 4: Get required roles — method-level overrides class-level
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // Step 5: No @Roles() decorator — any authenticated user may access
    if (!requiredRoles || requiredRoles.length === 0) return true;

    // Step 6: Admin role always passes
    if (user.role === Role.Admin) return true;

    // Step 7: Check if user's role is in the required list
    return requiredRoles.includes(user.role);
  }
}
