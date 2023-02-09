import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Movie } from '../entities/movie.entity';

@Injectable()
export class MovieRepository extends Repository<Movie> {
  constructor(dataSource: DataSource) {
    super(Movie, dataSource.createEntityManager());
  }

  getMovies(): Promise<Array<Movie>> {
    return this.find({
      select: ['movieId', 'title', 'description', 'stock', 'likes'],
    });
  }

  findMovieById(movieId: string): Promise<Movie> {
    return this.findOne({ where: { movieId: movieId } });
  }

  findMovieByTitle(title: string): Promise<Movie> {
    return this.findOne({ where: { title: title } });
  }
  async deleteMovie(movieId: string) {
    const movie = await this.findOne({
      where: { movieId: movieId },
    });

    if (!movie) throw new NotFoundException('movie not found');

    return this.delete(movieId) && `Movie with id ${movieId} was delete`;
  }
}
