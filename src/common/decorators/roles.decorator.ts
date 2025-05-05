import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/modules/user/schema/user.schema';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
