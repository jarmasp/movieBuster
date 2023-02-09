import { IsString, IsNotEmpty } from '@nestjs/class-validator';

export class ChangeRoleDto {
  @IsString()
  @IsNotEmpty()
  role: string;
}
