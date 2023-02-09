import {
  Controller,
  Post,
  UseGuards,
  Req,
  HttpCode,
  Body,
  Query,
} from '@nestjs/common';
import { AuthenticationService } from './services/authentication.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { DeleteResult, UpdateResult } from 'typeorm';
import { ApiTags, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { EmailDto } from './dto/email.dto';
import { ResetPasswordService } from './services/reset-password.service';
import { ResetTokenDto } from './dto/reset-token.dto';
import { ChangePasswordDto } from 'src/users/dto/change-password.dto';

@ApiTags('auth')
@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly resetPasswordService: ResetPasswordService,
  ) {}

  @ApiBody({ type: LoginDto })
  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Req() req): Promise<{ accessToken: string }> {
    return this.authenticationService.login(req.user);
  }

  @ApiBearerAuth()
  @HttpCode(200)
  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  logout(@Req() req: Request): Promise<DeleteResult> {
    return this.authenticationService.logout(req);
  }

  @Post('password/reset')
  resetPassword(@Body() emailDto: EmailDto): void {
    this.resetPasswordService.sendResetEmail(emailDto.email);
  }

  @Post('password/set')
  setPassword(
    @Query() resetTokenDto: ResetTokenDto,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<UpdateResult> {
    return this.resetPasswordService.setPassword(
      resetTokenDto.token,
      changePasswordDto.password,
    );
  }
}
