import { IsJWT } from '@nestjs/class-validator';

export class ResetTokenDto {
  @IsJWT()
  token: string;
}
