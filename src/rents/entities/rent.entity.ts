import { ApiHideProperty } from '@nestjs/swagger';
import { RentDetails } from '../../rent-details/entities/rent-details.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Rent {
  @PrimaryGeneratedColumn('uuid')
  rentId: string;

  @CreateDateColumn()
  rentedAt: Date;

  @Column()
  returnDate: Date;

  @Column({ default: 'pending' })
  status: string;

  @ApiHideProperty()
  @ManyToOne(() => User, (user) => user.rents)
  user!: User;

  @OneToMany(() => RentDetails, (rentDetails) => rentDetails.rent)
  details: RentDetails[];
}
