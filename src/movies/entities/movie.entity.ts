import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Tag } from '../../tags/entities/tag.entity';
import { User } from '../../users/entities/user.entity';
import { ApiHideProperty } from '@nestjs/swagger';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn('uuid')
  movieId: string;

  @Column({ length: 50, unique: true })
  title: string;

  @Column({ length: 500 })
  description: string;

  @Column()
  poster: string;

  @Column()
  trailer: string;

  @Column({ type: 'integer' })
  rentPrice: number;

  @Column({ type: 'integer' })
  salePrice: number;

  @Column({ type: 'integer' })
  stock: number;

  @Column({ type: 'integer', default: 0 })
  likes: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  modifiedAt: Date;

  @ManyToMany(() => Tag, { eager: true })
  @JoinTable({ name: 'movie_tag' })
  tags: Tag[];

  @ApiHideProperty()
  @ManyToMany(() => User, (user) => user.movies)
  users: User[];
}
