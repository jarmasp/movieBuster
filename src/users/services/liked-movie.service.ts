import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { Movie } from 'src/movies/entities/movie.entity';

@Injectable()
export class LikedMoviesService {
  constructor(private readonly userRepository: UserRepository) {}

  async getLikedMovies(userId: string): Promise<Array<Movie>> {
    const user = await this.userRepository.findOne({
      where: { userId: userId },
      relations: ['movies'],
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user.movies;
  }
}
