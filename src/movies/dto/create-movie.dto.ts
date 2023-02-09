import {
  IsString,
  IsNotEmpty,
  IsUrl,
  IsPositive,
  IsOptional,
  IsArray,
  IsInt,
} from '@nestjs/class-validator';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUrl()
  poster: string;

  @IsUrl()
  trailer: string;

  @IsInt()
  @IsPositive()
  rentPrice: number;

  @IsInt()
  @IsPositive()
  salePrice: number;

  @IsInt()
  @IsPositive()
  stock: number;

  @IsArray()
  @IsOptional()
  @IsNotEmpty({ each: true })
  tags?: string[];
}
