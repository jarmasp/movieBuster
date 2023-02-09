import { IsString, IsEmail, MinLength } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(2)
  lastname: string;

  @IsString()
  @IsEmail()
  @MinLength(5)
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
