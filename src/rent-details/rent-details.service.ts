import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RentDetails } from './entities/rent-details.entity';
import { Repository, UpdateResult } from 'typeorm';
import { MovieRepository } from '../movies/repositories/movie.repository';
import { Movie } from '../movies/entities/movie.entity';
import { SubOrderInfo } from '../order-details/dto/order-details.dto';

@Injectable()
export class RentDetailsService {
  constructor(
    @InjectRepository(RentDetails)
    private readonly rentDetailsRepository: Repository<RentDetails>,
    private readonly movieRepository: MovieRepository,
  ) {}

  async validateSubRent(suborder: SubOrderInfo): Promise<Movie> {
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

  async makeSubRent(movie: Movie, quantity: number): Promise<RentDetails> {
    const updatedMovie = await this.movieRepository.save(movie);

    return this.rentDetailsRepository.save({
      quantity: quantity,
      movie: updatedMovie,
      rentPrice: updatedMovie.rentPrice,
      subTotal: updatedMovie.rentPrice * quantity,
    });
  }

  async returnSubRent(movie: Movie, quantity: number): Promise<UpdateResult> {
    return this.movieRepository.update(movie.movieId, {
      stock: movie.stock + quantity,
    });
  }
}
