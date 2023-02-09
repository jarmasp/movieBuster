import { IsUUID } from '@nestjs/class-validator';

export class UserIdDto {
  @IsUUID()
  userId: string;
}
