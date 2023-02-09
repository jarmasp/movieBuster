import { Injectable } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { UserPayload } from '../dto/user-payload.dto';
import { TokenPayload } from '../dto/token-payload.dto';
import { UserRepository } from '../../users/repositories/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: TokenPayload): Promise<UserPayload> {
    const role = (
      await this.userRepository.findOne({
        where: { userId: payload.sub },
      })
    ).role;

    return { userId: payload.sub, email: payload.username, role };
  }
}
