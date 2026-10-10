/**
 * @sdd
 * - [Objetivo]: Proveer servicios de consulta y búsqueda de aves desde la base de datos de PostgreSQL.
 * - [I/O]: Inyecta Repository<BirdEntity>. Retorna BirdEntity[] en search() y BirdEntity | null en findById().
 * - [Edge Cases]: Sanitización de queries cortas (<2 caracteres), escape de comodines SQL, límites de resultados para evitar sobrecarga de memoria.
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BirdEntity } from '../../infrastructure/entities/bird.entity';

@Injectable()
export class BirdsService {
  constructor(
    @InjectRepository(BirdEntity)
    private readonly birdRepo: Repository<BirdEntity>,
  ) {}

  /**
   * Busca aves en Postgres por nombre común, científico o inglés.
   * @param query Término de búsqueda.
   * @param limit Límite máximo de aves a retornar (por defecto 15).
   * @returns Lista de entidades BirdEntity que coinciden con el término.
   */
  async search(query: string, limit = 15): Promise<BirdEntity[]> {
    const q = (query || '').trim();
    if (!q || q.length < 2) {
      return [];
    }

    return this.birdRepo
      .createQueryBuilder('bird')
      .select([
        'bird.id',
        'bird.scientific_name',
        'bird.english_name',
        'bird.common_name',
        'bird.base_image',
        'bird.min_altitude',
        'bird.max_altitude',
        'bird.viewing_difficulty',
      ])
      .where(
        'bird.common_name ILIKE :q OR bird.scientific_name ILIKE :q OR bird.english_name ILIKE :q',
        { q: `%${q}%` },
      )
      .limit(limit)
      .getMany();
  }

  /**
   * Obtiene la entidad de un ave por su ID.
   * @param id Identificador numérico del ave.
   * @returns BirdEntity si existe, o null.
   */
  async findById(id: number): Promise<BirdEntity | null> {
    return this.birdRepo.findOne({ where: { id } });
  }
}
