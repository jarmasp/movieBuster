import { ValidateNested, ArrayNotEmpty } from '@nestjs/class-validator';
import { SubOrderInfo } from '../../order-details/dto/order-details.dto';
import { Type } from 'class-transformer';

export class RentDto {
  @ValidateNested()
  @ArrayNotEmpty()
  @Type(() => SubOrderInfo)
  rent: SubOrderInfo[];
}
