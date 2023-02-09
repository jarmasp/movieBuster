import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../../users/repositories/user.repository';
import { EmailService } from '../../email/email.service';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessToken } from '../entities/token.entity';
import { Repository, UpdateResult } from 'typeorm';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { sign, verify } from 'jsonwebtoken';
import { HashHelper } from '../../users/services/hash.helper';

@Injectable()
export class ResetPasswordService {
  private secret: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
    @InjectRepository(AccessToken)
    private readonly accessTokenRepository: Repository<AccessToken>,
    private readonly hashHelper: HashHelper,
  ) {
    this.secret = this.configService.get('JWT_SECRET_RESET_PASSWORD');
  }

  async sendResetEmail(email: string): Promise<void> {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    const jti = randomStringGenerator();
    const payload = { sub: user.userId, email: user.email };

    await this.accessTokenRepository.save({ userId: user.userId, jti });

    const token = sign(payload, this.secret, { jwtid: jti, expiresIn: '6h' });

    await this.emailService.sendResetPasswordEmail(user.email, token);
  }

  async setPassword(token: string, password: string): Promise<UpdateResult> {
    const resetToken = verify(token, this.secret);

    const { jti, sub: userId } = resetToken as { sub: string; jti: string };

    const validToken = await this.accessTokenRepository.findOne({
      where: {
        jti: jti,
        userId: userId,
      },
    });

    if (!validToken) {
      throw new UnprocessableEntityException('invalid token');
    }

    await this.accessTokenRepository.delete({ jti, userId });

    return this.userRepository.update(userId, {
      password: this.hashHelper.hash(password),
    });
  }
}
