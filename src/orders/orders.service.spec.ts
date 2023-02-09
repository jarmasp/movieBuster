import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { Repository } from 'typeorm';
import { UserRepository } from '../users/repositories/user.repository';
import { EmailService } from '../email/email.service';
import { OrderDetailsService } from '../order-details/order-details.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('OrdersService', () => {
  let service: OrdersService;
  let orderRepo: Repository<any>;
  let userRepo: UserRepository;
  let orderDetailService: OrderDetailsService;
  let emailService: EmailService;

  const mockOrderRepo = () => ({
    save: jest.fn(),
  });

  const mockUserRepo = () => ({
    findOne: jest.fn(),
  });

  const mockOrderDetailService = () => ({
    validateSubOrder: jest.fn(),
    makeSubOrder: jest.fn(),
  });

  const mockEmailService = () => ({
    send: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useFactory: mockOrderRepo,
        },
        {
          provide: UserRepository,
          useFactory: mockUserRepo,
        },
        {
          provide: OrderDetailsService,
          useFactory: mockOrderDetailService,
        },
        {
          provide: EmailService,
          useFactory: mockEmailService,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    orderRepo = module.get<Repository<any>>(getRepositoryToken(Order));
    userRepo = module.get<UserRepository>(UserRepository);
    orderDetailService = module.get<OrderDetailsService>(OrderDetailsService);
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

      expect(service.buyMovie('userId', mockOrder)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw not found exception if user is not found', () => {
      const mockOrder = [{ movieId: '1', quantity: 1 }];

      (userRepo.findOne as jest.Mock).mockResolvedValue(null);

      expect(service.buyMovie('userId', mockOrder)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return a completed order', async () => {
      const mockOrder = [
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

      const mockOrderDto = {
        user: { email: 'user email' },
        details: mockDetails,
        total: 20,
      };

      (userRepo.findOne as jest.Mock).mockResolvedValue({
        email: 'user email',
      });

      (orderDetailService.validateSubOrder as jest.Mock)
        .mockResolvedValueOnce({
          title: 'movie 1',
          salePrice: 10,
        })
        .mockResolvedValueOnce({
          title: 'movie 2',
          salePrice: 10,
        });

      (orderDetailService.makeSubOrder as jest.Mock)
        .mockResolvedValueOnce({
          subTotal: 10,
        })
        .mockResolvedValueOnce({
          subTotal: 10,
        });

      (orderRepo.save as jest.Mock).mockResolvedValue(mockOrderDto);

      const order = await service.buyMovie('userId', mockOrder);

      expect(userRepo.findOne).toHaveBeenCalledTimes(1);
      expect(orderDetailService.validateSubOrder).toHaveBeenCalledTimes(2);
      expect(orderDetailService.makeSubOrder).toHaveBeenCalledTimes(2);
      expect(orderRepo.save).toHaveBeenCalledWith(mockOrderDto);
      expect(order).toStrictEqual(mockOrderDto);
      expect(emailService.send).toHaveBeenCalledWith(
        'user email',
        mockOrderDto,
        'order',
      );
    });
  });
});
