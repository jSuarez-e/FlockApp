import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../../infrastructure/entities/user.entity';
import { PasswordResetEntity } from '../../infrastructure/entities/password-reset.entity';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService (Flujo OTP)', () => {
  let service: AuthService;
  let passwordResetRepo: typeof mockRepository;

  const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mocked_token'),
    verify: jest.fn().mockReturnValue(true),
  };

  const mockMailerService = {
    sendMail: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(UserEntity), useValue: mockRepository },
        {
          provide: getRepositoryToken(PasswordResetEntity),
          useValue: mockRepository,
        },
        { provide: JwtService, useValue: mockJwtService },
        { provide: MailerService, useValue: mockMailerService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    passwordResetRepo = module.get(getRepositoryToken(PasswordResetEntity));
  });

  it('debe fallar verifyOtp si el código no coincide o expiró', async () => {
    passwordResetRepo.findOne.mockResolvedValue(null);
    await expect(service.verifyOtp('test@test.com', '000000')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('debe generar un recoveryToken válido tras un OTP correcto', async () => {
    const mockEntry = {
      email: 'test@test.com',
      otp: '123456',
      expiresAt: new Date(Date.now() + 10000),
    };
    passwordResetRepo.findOne.mockResolvedValue(mockEntry);

    const result = await service.verifyOtp('test@test.com', '123456');
    expect(result.recoveryToken).toBe('mocked_token');
    expect(passwordResetRepo.save).toHaveBeenCalled();
  });
});
