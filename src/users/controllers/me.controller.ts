import { Controller, Get, UseGuards, Post, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoggedUser } from '../decorators/user.decorator';
import { UserPayload } from '../../authentication/dto/user-payload.dto';
import { UsersService } from '../services/users.service';
import { RentedMoviesService } from '../services/rented-movie.service';
import { LikedMoviesService } from '../services/liked-movie.service';
import { BoughtMoviesService } from '../services/bought-movie.service';
import { User } from '../entities/user.entity';
import { Movie } from 'src/movies/entities/movie.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Rent } from 'src/rents/entities/rent.entity';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { UpdateResult } from 'typeorm';
import { ApiTags, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('user/me')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('user/me')
export class MeController {
  constructor(
    private readonly usersService: UsersService,
    private readonly rentedMoviesService: RentedMoviesService,
    private readonly likedMoviesService: LikedMoviesService,
    private readonly boughtMoviesService: BoughtMoviesService,
  ) {}

  @Get()
  getProfile(@LoggedUser() user: UserPayload): Promise<User> {
    return this.usersService.findUserById(user.userId);
  }

  @Get('likes')
  getLikedMovies(@LoggedUser() user: UserPayload): Promise<Array<Movie>> {
    return this.likedMoviesService.getLikedMovies(user.userId);
  }

  @Get('orders')
  getBoughtMovies(@LoggedUser() user: UserPayload): Promise<Array<Order>> {
    return this.boughtMoviesService.getBoughtMovies(user.userId);
  }

  @Get('rents')
  getRentedMovies(@LoggedUser() user: UserPayload): Promise<Array<Rent>> {
    return this.rentedMoviesService.getRentedMovies(user.userId);
  }

  @ApiBody({ type: ChangePasswordDto })
  @Post('changePassword')
  changePassword(
    @LoggedUser() user: UserPayload,
    @Body() passwordDto: ChangePasswordDto,
  ): Promise<UpdateResult> {
    return this.usersService.changePassword(user.userId, passwordDto.password);
  }
}
