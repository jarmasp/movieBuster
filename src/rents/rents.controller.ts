import { Controller, Post, UseGuards, Body, Param } from '@nestjs/common';
import { RentsService } from './rents.service';
import { AuthGuard } from '@nestjs/passport';
import { LoggedUser } from '../users/decorators/user.decorator';
import { UserPayload } from '../authentication/dto/user-payload.dto';
import { RentDto } from './dto/rent.dto';
import { ReturnDto } from './dto/return.dto';
import { UpdateResult } from 'typeorm';
import { Rent } from './entities/rent.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('rents')
@Controller('rents')
export class RentsController {
  constructor(private readonly rentsService: RentsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  rentMovie(
    @LoggedUser() user: UserPayload,
    @Body() rentDto: RentDto,
  ): Promise<Rent> {
    return this.rentsService.rentMovie(user.userId, rentDto.rent);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':rentId/return')
  returnMovie(
    @Param() returnDto: ReturnDto,
    @LoggedUser() user: UserPayload,
  ): Promise<UpdateResult> {
    return this.rentsService.returnMovie(returnDto.rentId, user.userId);
  }
}
