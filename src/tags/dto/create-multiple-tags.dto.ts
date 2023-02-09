import {
  IsArray,
  IsString,
  IsNotEmpty,
  MinLength,
} from '@nestjs/class-validator';

export class CreateMultipleTagsDto {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  @MinLength(1, { each: true })
  tags: string[];
}
