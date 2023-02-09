import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetails } from './entities/order-details.entity';
import { Repository } from 'typeorm';
import { MovieRepository } from '../movies/repositories/movie.repository';
import { SubOrderInfo } from './dto/order-details.dto';
import { Movie } from '../movies/entities/movie.entity';

@Injectable()
export class OrderDetailsService {
  constructor(
    @InjectRepository(OrderDetails)
    private readonly orderDetailsRepository: Repository<OrderDetails>,
    private readonly movieRepository: MovieRepository,
  ) {}

  async makeSubOrder(movie: Movie, quantity: number): Promise<OrderDetails> {
    const updatedMovie = await this.movieRepository.save(movie);

    return this.orderDetailsRepository.save({
      quantity: quantity,
      movie: updatedMovie,
      salePrice: updatedMovie.salePrice,
      subTotal: updatedMovie.salePrice * quantity,
    });
  }

  async validateSubOrder(suborder: SubOrderInfo): Promise<Movie> {
    const movie = await this.movieRepository.findOne({
      where: { movieId: suborder.movieId },
    });
    if (!movie) {
      throw new NotFoundException('movie not found');
    }

    if (movie.stock < suborder.quantity) {
      throw new UnprocessableEntityException(
        `there is not enough stock for ${movie.title}`,
      );
    }

    const stock = movie.stock;

    return { ...movie, stock: stock - suborder.quantity };
  }
}
