import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ApiHideProperty } from '@nestjs/swagger';
import { OrderDetails } from '../../order-details/entities/order-details.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  orderId: string;

  @CreateDateColumn()
  boughtAt: Date;

  @ApiHideProperty()
  @ManyToOne(() => User, (user) => user.orders)
  user!: User;

  @OneToMany(() => OrderDetails, (orderDetail) => orderDetail.order)
  details: OrderDetails[];
}
