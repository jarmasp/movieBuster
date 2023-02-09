import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieRepository } from './repositories/movie.repository';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { TagsModule } from 'src/tags/tags.module';
import { UsersModule } from 'src/users/users.module';
import { Movie } from './entities/movie.entity';
import { UserRepository } from 'src/users/repositories/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Movie]), TagsModule, UsersModule],
  providers: [MoviesService, MovieRepository, UserRepository],
  controllers: [MoviesController],
  exports: [TypeOrmModule, UsersModule, MovieRepository],
})
export class MoviesModule {}
