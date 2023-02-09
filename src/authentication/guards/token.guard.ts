import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessToken } from '../entities/token.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from '../dto/token-payload.dto';
import { getBearer } from '../services/token.helper';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(
    @InjectRepository(AccessToken)
    private readonly tokenRepository: Repository<AccessToken>,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req: Request = context.switchToHttp().getRequest();

      const tokenPayload = this.jwtService.decode(
        getBearer(req),
      ) as TokenPayload;

      const res = await this.tokenRepository.findOne({
        where: { jti: tokenPayload.jti },
      });

      return res ? true : false;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
