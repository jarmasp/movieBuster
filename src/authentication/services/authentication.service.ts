import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UserPayload } from '../dto/user-payload.dto';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessToken } from '../entities/token.entity';
import { Repository, DeleteResult } from 'typeorm';
import { Request } from 'express';
import { TokenPayload } from '../dto/token-payload.dto';
import { getBearer } from './token.helper';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(AccessToken)
    private readonly tokenRepository: Repository<AccessToken>,
  ) {}

  async validateUser(email: string, password: string): Promise<UserPayload> {
    const user = await this.usersService.findUserByEmail(email);
    if (user && compare(password, user.password)) {
      const { userId, email } = user;
      return { userId, email };
    }
    return null;
  }

  async login(user: UserPayload): Promise<{ accessToken: string }> {
    const jti: string = randomStringGenerator();

    await this.tokenRepository.save({ jti, userId: user.userId });

    const payload = { username: user.email, sub: user.userId };
    return {
      accessToken: this.jwtService.sign(payload, {
        jwtid: jti,
      }),
    };
  }

  async logout(req: Request): Promise<DeleteResult> {
    const token = this.jwtService.decode(getBearer(req)) as TokenPayload;

    return this.tokenRepository.delete({ userId: token.sub, jti: token.jti });
  }
}
