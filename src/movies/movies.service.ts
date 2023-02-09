import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Movie } from './entities/movie.entity';
import { MovieRepository } from './repositories/movie.repository';
import { CreateMovieDto } from './dto/create-movie.dto';
import { TagsService } from '../tags/tags.service';
import { Tag } from '../tags/entities/tag.entity';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { UserPayload } from '../authentication/dto/user-payload.dto';
import { UserRepository } from '../users/repositories/user.repository';
import { SerializedUser } from '../users/dto/user.serialize';

@Injectable()
export class MoviesService {
  constructor(
    private readonly movieRepository: MovieRepository,
    private readonly tagsService: TagsService,
    private readonly userRepository: UserRepository,
  ) {}

  getMovies(): Promise<Array<Movie>> {
    return this.movieRepository.getMovies();
  }

  getMovie(movieId: string): Promise<Movie> {
    return this.movieRepository.findMovieById(movieId);
  }

  async createMovie(createMovieDto: CreateMovieDto): Promise<Movie> {
    await this.movieRepository.findMovieByTitle(createMovieDto.title);

    let tags: Array<Tag> = [];
    if (createMovieDto.tags.length) {
      tags = await this.tagsService.createTags({ tags: createMovieDto.tags });
    }

    const movie = { ...createMovieDto, tags };

    return this.movieRepository.save(movie);
  }

  async updateMovie(
    movieId: string,
    updateMovieDto: UpdateMovieDto,
  ): Promise<Movie> {
    const movie = await this.movieRepository.findOne({
      where: { movieId: movieId },
    });
    if (!movie) throw new NotFoundException('movie not found');

    const { tags, ...properties } = updateMovieDto;

    if (properties.title) {
      const searchedByTitle = await this.movieRepository.findOne({
        where: {
          title: updateMovieDto.title,
        },
      });
      if (searchedByTitle && searchedByTitle.movieId !== movie.movieId) {
        throw new ConflictException('other movie already has that title');
      }
    }

    if (tags && tags.length) {
      const updatedTags = await this.tagsService.createTags({ tags: tags });

      return this.movieRepository.save({
        ...movie,
        ...properties,
        tags: updatedTags,
      });
    }

    return this.movieRepository.save({ ...movie, ...properties });
  }

  async deleteMovie(movieId: string) {
    return this.movieRepository.deleteMovie(movieId);
  }

  async likeMovie(userPayload: UserPayload, movieId: string): Promise<void> {
    const movie = await this.movieRepository.findOne({
      where: { movieId: movieId },
    });
    if (!movie) throw new NotFoundException('movie not found');

    const numLikes = movie.likes;

    const user = await this.userRepository.findOne({
      where: { userId: userPayload.userId },
      relations: ['movies'],
    });
    const movies = user.movies;

    if (!movies.map((movie) => movie.movieId).includes(movie.movieId)) {
      const updatedMovie = await this.movieRepository.save({
        ...movie,
        likes: numLikes + 1,
      });

      this.userRepository.save({
        ...user,
        movies: [...movies, updatedMovie],
      });
    }
  }

  async getFanUsers(movieId: string): Promise<Array<SerializedUser>> {
    const movie = await this.movieRepository.findOne({
      where: { movieId: movieId },
      relations: ['users'],
    });
    if (!movie) {
      throw new NotFoundException('movie not found');
    }

    return movie.users.map((user) => new SerializedUser(user));
  }
}
