import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../../infrastructure/entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { MedalsService } from './medals.service';

describe('UsersService', () => {
  let service: UsersService;

  const mockUser = {
    id: 'uuid-123',
    email: 'test@test.com',
    firstName: 'John',
    createdAt: new Date(),
  };
  const mockRepository = {
    findOne: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockRepository,
        },
        {
          provide: DataSource,
          useValue: {
            getRepository: jest.fn().mockReturnValue({
              createQueryBuilder: jest.fn().mockReturnThis(),
              leftJoin: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              select: jest.fn().mockReturnThis(),
              addSelect: jest.fn().mockReturnThis(),
              getRawOne: jest
                .fn()
                .mockResolvedValue({ totalKm: 0, sightingsCount: 0 }),
            }),
          },
        },
        {
          provide: MedalsService,
          useValue: {
            evaluateUserMedals: jest.fn().mockResolvedValue(undefined),
            getUserMedalsWithStatus: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('debe retornar un usuario si existe', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);
      const result = await service.findOne('uuid-123');
      expect(result).toEqual(mockUser);
    });

    it('debe lanzar NotFoundException si no existe', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('invalid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateProfile', () => {
    it('debe llamar al repositorio si hay datos válidos', async () => {
      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.findOne.mockResolvedValue(mockUser);

      await service.updateProfile('uuid-123', { firstName: 'NewName' });
      expect(mockRepository.update).toHaveBeenCalledWith('uuid-123', {
        firstName: 'NewName',
      });
    });
  });
});
