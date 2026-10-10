import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BirdsService } from './birds.service';
import { BirdEntity } from '../../infrastructure/entities/bird.entity';

describe('BirdsService', () => {
  let service: BirdsService;

  const mockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([
      {
        id: 1,
        scientific_name: 'Chlorostilbon olivaresi',
        common_name: 'Esmeralda del Chiribiquete',
        english_name: 'Chiribiquete Emerald',
        base_image: 'https://example.com/emerald.jpg',
      },
    ]),
  };

  const mockBirdRepo = {
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    findOne: jest.fn().mockResolvedValue({
      id: 1,
      scientific_name: 'Chlorostilbon olivaresi',
      common_name: 'Esmeralda del Chiribiquete',
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BirdsService,
        {
          provide: getRepositoryToken(BirdEntity),
          useValue: mockBirdRepo,
        },
      ],
    }).compile();

    service = module.get<BirdsService>(BirdsService);
  });

  it('debería retornar un array vacío si la consulta tiene menos de 2 caracteres', async () => {
    const res = await service.search('a');
    expect(res).toEqual([]);
  });

  it('debería buscar aves por nombre con ILIKE en Postgres', async () => {
    const res = await service.search('Esmeralda');
    expect(mockBirdRepo.createQueryBuilder).toHaveBeenCalledWith('bird');
    expect(mockQueryBuilder.where).toHaveBeenCalledWith(
      'bird.common_name ILIKE :q OR bird.scientific_name ILIKE :q OR bird.english_name ILIKE :q',
      { q: '%Esmeralda%' },
    );
    expect(res.length).toBe(1);
    expect(res[0].scientific_name).toBe('Chlorostilbon olivaresi');
  });

  it('debería encontrar un ave por su ID', async () => {
    const res = await service.findById(1);
    expect(mockBirdRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(res?.id).toBe(1);
  });
});
