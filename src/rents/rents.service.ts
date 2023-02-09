import {
  Injectable,
  NotFoundException,
  MethodNotAllowedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rent } from './entities/rent.entity';
import { Repository, UpdateResult } from 'typeorm';
import { UserRepository } from '../users/repositories/user.repository';
import { SubOrderInfo } from '../order-details/dto/order-details.dto';
import { RentDetailsService } from '../rent-details/rent-details.service';
import { Movie } from '../movies/entities/movie.entity';
import { RentDetails } from '../rent-details/entities/rent-details.entity';
import { EmailService } from '../email/email.service';

@Injectable()
export class RentsService {
  constructor(
    @InjectRepository(Rent) private readonly rentRepository: Repository<Rent>,
    private readonly userRepository: UserRepository,
    private readonly rentDetailsService: RentDetailsService,
    private readonly emailService: EmailService,
  ) {}

  async rentMovie(userId: string, rent: Array<SubOrderInfo>): Promise<Rent> {
    const uniqueMovieIds = rent
      .map((suborder) => suborder.movieId)
      .every((id, i, a) => a.indexOf(id) === a.lastIndexOf(id));

    if (!uniqueMovieIds) {
      throw new BadRequestException('every movie Id must be unique');
    }

    const user = await this.userRepository.findOne({
      where: { userId: userId },
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }

    const movies = new Array<Movie>();

    for (const subrent of rent) {
      const res = await this.rentDetailsService.validateSubRent(subrent);
      movies.push(res);
    }

    const subrentTuples = movies.map((movie, i) => ({
      movie,
      quantity: rent[i].quantity,
    }));

    const rentDetails = new Array<RentDetails>();

    for (const subrent of subrentTuples) {
      const res = await this.rentDetailsService.makeSubRent(
        subrent.movie,
        subrent.quantity,
      );
      rentDetails.push(res);
    }

    const rentTotalBilled = rentDetails
      .map((suborder) => suborder.subTotal)
      .reduce((a, b) => a + b);

    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + 3);

    const movieRent = await this.rentRepository.save({
      user,
      details: rentDetails,
      total: rentTotalBilled,
      returnDate,
    });

    this.emailService.send(user.email, movieRent, 'rent');

    return movieRent;
  }

  async returnMovie(rentId: string, userId: string): Promise<UpdateResult> {
    const rent = await this.rentRepository.findOne({
      where: { rentId: rentId },
      relations: ['details', 'details.movie'],
    });

    if (!rent) {
      throw new NotFoundException('rent not found');
    }

    /*     if (rent.user.userId !== userId) {
      throw new MethodNotAllowedException(
        'only the owner of a rent can return it',
      );
    } */

    if (rent.status === 'returned') {
      throw new MethodNotAllowedException(
        'the movie/s have already been returned',
      );
    }

    const returningMovies = rent.details.map((subrent) => ({
      movie: subrent.movie,
      quantity: subrent.quantity,
    }));

    for (const subrent of returningMovies) {
      console.log('returning movie: ', subrent.movie.title);
      await this.rentDetailsService.returnSubRent(
        subrent.movie,
        subrent.quantity,
      );
      console.log('movie returned: ', subrent.movie.title);
    }

    return this.rentRepository.update(rentId, { status: 'returned' });
  }
}
