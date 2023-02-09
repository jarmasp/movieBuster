import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/orders/entities/order.entity';
import { Repository } from 'typeorm';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class BoughtMoviesService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly userRepository: UserRepository,
  ) {}

  async getBoughtMovies(userId: string): Promise<Order[]> {
    const user = await this.userRepository.findOne({
      where: { userId: userId },
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }

    const res = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.details', 'detail')
      .leftJoinAndSelect('detail.movie', 'movie')
      .select(['order', 'detail', 'movie.movieId', 'movie.title'])
      .where({ user: userId })
      .getMany();

    return res;
  }
}
