import { IsEmail } from '@nestjs/class-validator';

export class EmailDto {
  @IsEmail()
  email: string;
}
