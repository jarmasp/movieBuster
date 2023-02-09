import { IsString, IsNotEmpty } from '@nestjs/class-validator';

export class CreateTagDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
