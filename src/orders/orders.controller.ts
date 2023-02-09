import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '@nestjs/passport';
import { LoggedUser } from '../users/decorators/user.decorator';
import { UserPayload } from '../authentication/dto/user-payload.dto';
import { OrderDto } from './dto/order.dto';
import { ApiTags } from '@nestjs/swagger';
import { Order } from './entities/order.entity';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  buyMovie(
    @LoggedUser() user: UserPayload,
    @Body() orderDto: OrderDto,
  ): Promise<Order> {
    return this.ordersService.buyMovie(user.userId, orderDto.order);
  }
}
