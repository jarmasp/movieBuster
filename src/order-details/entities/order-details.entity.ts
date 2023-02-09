import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Movie } from '../../movies/entities/movie.entity';
import { Order } from '../../orders/entities/order.entity';

@Entity()
export class OrderDetails {
  @PrimaryGeneratedColumn('uuid')
  orderDetailId: string;

  @Column({ type: 'integer' })
  quantity: number;

  @Column()
  salePrice: number;

  @Column()
  subTotal: number;

  @ManyToOne(() => Movie)
  movie!: Movie;

  @ManyToOne(() => Order, (order) => order.details)
  order!: Order;
}
