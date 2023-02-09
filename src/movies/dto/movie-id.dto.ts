import { IsUUID } from '@nestjs/class-validator';

export class MovieIdDto {
  @IsUUID()
  movieId: string;
}
