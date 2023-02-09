import { LocalStrategy } from './local.strategy';
import { AuthenticationService } from '../services/authentication.service';
import { Test } from '@nestjs/testing';

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;
  let authenticationService: AuthenticationService;

  const mockAuthenticationService = () => ({
    validateUser: jest.fn(),
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthenticationService,
          useFactory: mockAuthenticationService,
        },
      ],
    }).compile();

    strategy = module.get<LocalStrategy>(LocalStrategy);
    authenticationService = module.get<AuthenticationService>(
      AuthenticationService,
    );
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return authenticated user', async () => {
      (authenticationService.validateUser as jest.Mock).mockResolvedValue(
        'user',
      );

      expect(await strategy.validate('username', 'password')).toBe('user');
      expect(authenticationService.validateUser).toHaveBeenCalledWith(
        'username',
        'password',
      );
    });
  });
});
