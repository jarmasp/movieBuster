import { IsUUID, IsInt, IsPositive } from '@nestjs/class-validator';

export class SubOrderInfo {
  @IsUUID()
  movieId: string;

  @IsInt()
  @IsPositive()
  quantity: number;
}
