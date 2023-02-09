import { OrderDetailsService } from './order-details.service';
import { Repository } from 'typeorm';
import { MovieRepository } from '../movies/repositories/movie.repository';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderDetails } from './entities/order-details.entity';
import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

describe('OrderDetailsService', () => {
  let service: OrderDetailsService;
  let orderDetailsRepo: Repository<any>;
  let movieRepo: MovieRepository;

  const mockOrderDetailsRepo = () => ({});

  const mockMovieRepo = () => ({
    findOne: jest.fn(),
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        OrderDetailsService,
        {
          provide: getRepositoryToken(OrderDetails),
          useFactory: mockOrderDetailsRepo,
        },
        { provide: MovieRepository, useFactory: mockMovieRepo },
      ],
    }).compile();

    service = module.get<OrderDetailsService>(OrderDetailsService);
    orderDetailsRepo = module.get<Repository<any>>(
      getRepositoryToken(OrderDetails),
    );
    movieRepo = module.get<MovieRepository>(MovieRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateSubOrder', () => {
    it('should throw a not found exception when the movie is not found', () => {
      (movieRepo.findOne as jest.Mock).mockResolvedValue(null);

      expect(
        service.validateSubOrder({ movieId: 'movieId', quantity: 1 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw an unprocessable entity exception when the movie stock is lesser than required quantity', () => {
      (movieRepo.findOne as jest.Mock).mockResolvedValue({ stock: 5 });

      expect(
        service.validateSubOrder({ movieId: 'movieId', quantity: 10 }),
      ).rejects.toThrow(UnprocessableEntityException);
    });

    it('should return the movie with updated stock', async () => {
      (movieRepo.findOne as jest.Mock).mockResolvedValue({ stock: 5 });

      expect(
        await service.validateSubOrder({ movieId: 'movieId', quantity: 1 }),
      ).toStrictEqual({ stock: 4 });
    });
  });
});
