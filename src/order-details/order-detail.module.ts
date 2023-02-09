import { Module } from '@nestjs/common';
import { OrderDetailsService } from './order-details.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetails } from './entities/order-details.entity';
import { MovieRepository } from 'src/movies/repositories/movie.repository';
import { Movie } from 'src/movies/entities/movie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderDetails, Movie])],
  providers: [OrderDetailsService, MovieRepository],
  exports: [TypeOrmModule, OrderDetailsService],
})
export class OrderDetailsModule {}
