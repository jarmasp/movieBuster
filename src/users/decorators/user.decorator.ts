import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPayload } from 'src/authentication/dto/user-payload.dto';

export const LoggedUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserPayload => {
    const req = ctx.switchToHttp().getRequest();
    return req.user as UserPayload;
  },
);
