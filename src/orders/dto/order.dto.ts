import { ValidateNested, ArrayNotEmpty } from '@nestjs/class-validator';
import { SubOrderInfo } from '../../order-details/dto/order-details.dto';
import { Type } from 'class-transformer';

export class OrderDto {
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  @Type(() => SubOrderInfo)
  order: SubOrderInfo[];
}
