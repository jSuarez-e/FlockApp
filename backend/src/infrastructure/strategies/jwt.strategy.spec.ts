import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { JwtPayload } from '../../application/interfaces/jwt-payload.interface';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  // Mock del ConfigService
  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'JWT_SECRET') return 'testSecret';
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('debería estar definido', () => {
    expect(strategy).toBeDefined();
  });

  it('debería validar y retornar el ValidatedUser mapeado', () => {
    const payload: JwtPayload = {
      sub: 1,
      email: 'test@test.com',
      role: 'PAJARERO',
    };

    const result = strategy.validate(payload);

    expect(result).toEqual({
      id: 1,
      email: 'test@test.com',
      role: 'PAJARERO',
    });
  });
});
