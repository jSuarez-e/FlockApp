import { Test, TestingModule } from '@nestjs/testing';
import { LocationsService } from './locations.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DepartmentEntity } from '../../infrastructure/entities/department.entity';
import { MunicipalityEntity } from '../../infrastructure/entities/municipality.entity';
import { Repository } from 'typeorm';

describe('LocationsService - Fix de Colisión', () => {
  let service: LocationsService;
  let deptRepo: Repository<DepartmentEntity>;

  const mockDeptRepository = {
    upsert: jest.fn(),
    find: jest.fn(),
    query: jest.fn(),
  };

  const mockMuniRepository = {
    upsert: jest.fn(),
    query: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationsService,
        {
          provide: getRepositoryToken(DepartmentEntity),
          useValue: mockDeptRepository,
        },
        {
          provide: getRepositoryToken(MunicipalityEntity),
          useValue: mockMuniRepository,
        },
      ],
    }).compile();

    service = module.get<LocationsService>(LocationsService);
    deptRepo = module.get<Repository<DepartmentEntity>>(
      getRepositoryToken(DepartmentEntity),
    );
  });

  it('debería insertar en la tabla de departamentos de forma aislada', async () => {
    const payload = {
      name: 'departamentos' as const,
      values: [[8, 'ATLÁNTICO']],
    };
    await service.seedFromJSON(payload);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(deptRepo.upsert).toHaveBeenCalledWith({ id: 8, name: 'ATLÁNTICO' }, [
      'id',
    ]);
  });
});
