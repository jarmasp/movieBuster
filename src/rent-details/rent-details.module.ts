import { Module } from '@nestjs/common';
import { RentDetailsService } from './rent-details.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RentDetails } from './entities/rent-details.entity';
import { MovieRepository } from '../movies/repositories/movie.repository';
import { Movie } from '../movies/entities/movie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RentDetails, Movie])],
  providers: [RentDetailsService, MovieRepository],
  exports: [TypeOrmModule, RentDetailsService],
})
export class RentDetailsModule {}
