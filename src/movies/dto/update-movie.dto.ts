import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsUrl,
  IsInt,
  IsPositive,
  IsArray,
} from '@nestjs/class-validator';

export class UpdateMovieDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsUrl()
  poster?: string;

  @IsOptional()
  @IsUrl()
  trailer?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  rentPrice: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  salePrice: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  stock: number;

  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  tags?: string[];
}
