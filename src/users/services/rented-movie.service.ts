import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rent } from 'src/rents/entities/rent.entity';
import { Repository } from 'typeorm';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class RentedMoviesService {
  constructor(
    @InjectRepository(Rent) private readonly rentRepository: Repository<Rent>,
    private readonly userRepository: UserRepository,
  ) {}

  async getRentedMovies(userId: string): Promise<Rent[]> {
    const user = await this.userRepository.findOne({
      where: { userId: userId },
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }

    const res = await this.rentRepository
      .createQueryBuilder('rent')
      .leftJoinAndSelect('rent.details', 'detail')
      .leftJoinAndSelect('detail.movie', 'movie')
      .select(['rent', 'detail', 'movie.movieId', 'movie.title'])
      .where({ user: userId })
      .getMany();

    return res;
  }
}
