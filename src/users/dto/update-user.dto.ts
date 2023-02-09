import {
  IsOptional,
  IsString,
  IsEmail,
  IsNotEmpty,
} from '@nestjs/class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsOptional()
  @IsEmail()
  email: string;
}
