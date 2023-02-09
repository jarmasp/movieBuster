import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserPayload } from '../dto/user-payload.dto';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<Array<string>>(
      'roles',
      context.getHandler(),
    );
    if (!roles) {
      return true;
    }

    const user: UserPayload = context.switchToHttp().getRequest().user;

    return user && roles.includes(user.role);
  }
}
