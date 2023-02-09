import { RentsService } from './rents.service';
import { Repository } from 'typeorm';
import { UserRepository } from '../users/repositories/user.repository';
import { RentDetailsService } from '../rent-details/rent-details.service';
import { EmailService } from '../email/email.service';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Rent } from './entities/rent.entity';
import {
  BadRequestException,
  NotFoundException,
  MethodNotAllowedException,
} from '@nestjs/common';

describe('RentsService', () => {
  let service: RentsService;
  let rentRepo: Repository<any>;
  let userRepo: UserRepository;
  let rentDetailsService: RentDetailsService;
  let emailService: EmailService;

  const mockRentRepo = () => ({
    save: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  });

  const mockUserRepo = () => ({
    findOne: jest.fn(),
  });

  const mockRentDetailsService = () => ({
    validateSubRent: jest.fn(),
    makeSubRent: jest.fn(),
    returnSubRent: jest.fn(),
  });

  const mockEmailService = () => ({
    send: jest.fn(),
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RentsService,
        {
          provide: getRepositoryToken(Rent),
          useFactory: mockRentRepo,
        },
        {
          provide: UserRepository,
          useFactory: mockUserRepo,
        },
        {
          provide: RentDetailsService,
          useFactory: mockRentDetailsService,
        },
        {
          provide: EmailService,
          useFactory: mockEmailService,
        },
      ],
    }).compile();

    service = module.get<RentsService>(RentsService);
    rentRepo = module.get<Repository<any>>(getRepositoryToken(Rent));
    userRepo = module.get<UserRepository>(UserRepository);
    rentDetailsService = module.get<RentDetailsService>(RentDetailsService);
    emailService = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('makeOrder', () => {
    it('should throw bad request exception if movieIds are not unique', () => {
      const mockOrder = [
        { movieId: '1', quantity: 1 },
        { movieId: '1', quantity: 1 },
      ];

      expect(service.rentMovie('userId', mockOrder)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw not found exception if user is not found', () => {
      const mockOrder = [{ movieId: '1', quantity: 1 }];

      (userRepo.findOne as jest.Mock).mockResolvedValue(null);

      expect(service.rentMovie('userId', mockOrder)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return a completed rent', async () => {
      const mockRent = [
        { movieId: '1', quantity: 1 },
        { movieId: '2', quantity: 1 },
      ];

      const mockDetails = [
        {
          subTotal: 10,
        },
        {
          subTotal: 10,
        },
      ];

      const returnDate = new Date();
      returnDate.setDate(returnDate.getDate() + 3);
      returnDate.setMilliseconds(returnDate.getMilliseconds() + 2);

      const mockRentDto = {
        user: { email: 'user email' },
        details: mockDetails,
        total: 20,
        returnDate,
      };

      (userRepo.findOne as jest.Mock).mockResolvedValue({
        email: 'user email',
      });

      (rentDetailsService.validateSubRent as jest.Mock)
        .mockResolvedValueOnce({
          title: 'movie 1',
          salePrice: 10,
        })
        .mockResolvedValueOnce({
          title: 'movie 2',
          salePrice: 10,
        });

      (rentDetailsService.makeSubRent as jest.Mock)
        .mockResolvedValueOnce({
          subTotal: 10,
        })
        .mockResolvedValueOnce({
          subTotal: 10,
        });

      (rentRepo.save as jest.Mock).mockResolvedValue(mockRentDto);

      const rent = await service.rentMovie('userId', mockRent);

      expect(userRepo.findOne).toHaveBeenCalledTimes(1);
      expect(rentDetailsService.validateSubRent).toHaveBeenCalledTimes(2);
      expect(rentDetailsService.makeSubRent).toHaveBeenCalledTimes(2);
      // expect(rentRepo.save).toHaveBeenCalledWith(mockRentDto);
      expect(rent).toStrictEqual(mockRentDto);
      expect(emailService.send).toHaveBeenCalledWith(
        'user email',
        mockRentDto,
        'rent',
      );
    });
  });

  describe('returnMovies', () => {
    it('should throw a not found exception when the rent is not found', () => {
      (rentRepo.findOne as jest.Mock).mockResolvedValue(null);

      expect(service.returnMovie('orderId', 'userId')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw method not allowed exception when another user try to return movies', () => {
      (rentRepo.findOne as jest.Mock).mockResolvedValue({
        user: { userId: 'userId' },
      });

      expect(service.returnMovie('rentId', 'otherUserId')).rejects.toThrow(
        MethodNotAllowedException,
      );
    });

    it('should throw method not allowed exception when movies are already returned', () => {
      (rentRepo.findOne as jest.Mock).mockResolvedValue({
        user: { userId: 'userId' },
        status: 'returned',
      });

      expect(service.returnMovie('rentId', 'userId')).rejects.toThrow(
        MethodNotAllowedException,
      );
    });

    it('should return movies and update rent', async () => {
      const mockDetails = [
        {
          movie: 'movie1',
          quantity: 1,
        },
        {
          movie: 'movie2',
          quantity: 1,
        },
      ];

      (rentRepo.findOne as jest.Mock).mockResolvedValue({
        user: { userId: 'userId' },
        status: 'pending',
        details: mockDetails,
      });

      await service.returnMovie('rentId', 'userId');

      expect(rentDetailsService.returnSubRent).toHaveBeenCalledTimes(2);
      expect(rentRepo.update).toHaveBeenCalledWith('rentId', {
        status: 'returned',
      });
    });
  });
});
