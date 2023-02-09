import { IsUUID } from '@nestjs/class-validator';

export class ReturnDto {
  @IsUUID()
  rentId: string;
}
