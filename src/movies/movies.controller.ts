import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';
import { MovieIdDto } from './dto/movie-id.dto';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { LoggedUser } from '../users/decorators/user.decorator';
import { UserPayload } from '../authentication/dto/user-payload.dto';
import { AuthGuard } from '@nestjs/passport';
import { TokenGuard } from '../authentication/guards/token.guard';
import { Roles } from '../authentication/decorators/role.decorator';
import { RoleGuard } from '../authentication/guards/role.guard';
import { SerializedUser } from '../users/dto/user.serialize';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  getMovies(): Promise<Array<Movie>> {
    return this.moviesService.getMovies();
  }

  @Get(':movieId')
  getMovie(@Param() movieIdDto: MovieIdDto): Promise<Movie> {
    return this.moviesService.getMovie(movieIdDto.movieId);
  }

  @Post()
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'), TokenGuard, RoleGuard)
  createMovie(@Body() createMovieDto: CreateMovieDto): Promise<Movie> {
    return this.moviesService.createMovie(createMovieDto);
  }

  @Put(':movieId')
  updateMovie(
    @Param() movieIdDto: MovieIdDto,
    @Body() updateMovieDto: UpdateMovieDto,
  ): Promise<Movie> {
    return this.moviesService.updateMovie(movieIdDto.movieId, updateMovieDto);
  }

  @Put(':movieId/like')
  @UseGuards(AuthGuard('jwt'), TokenGuard)
  likeMovie(
    @Param() movieIdDto: MovieIdDto,
    @LoggedUser() user: UserPayload,
  ): void {
    this.moviesService.likeMovie(user, movieIdDto.movieId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':movieId/fans')
  getFanUsers(@Param() movieIdDto: MovieIdDto): Promise<Array<SerializedUser>> {
    return this.moviesService.getFanUsers(movieIdDto.movieId);
  }
}
