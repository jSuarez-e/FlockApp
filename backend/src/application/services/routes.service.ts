/**
 * @sdd
 * - [Objetivo]: Proveer lógica de negocio para gestionar rutas desde PostgreSQL.
 * - [I/O]: Expone métodos para consultar rutas enviadas y borradores.
 * - [Edge Cases]: Usado por RoutesController.
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RouteEntity } from '../../infrastructure/entities/route.entity';
import { IRoute } from '../../../../shared/models/routes.interface';

@Injectable()
export class RoutesService {
  constructor(
    @InjectRepository(RouteEntity)
    private readonly routeRepository: Repository<RouteEntity>,
  ) {}

  /**
   * @description Obtiene las rutas con agregaciones de especies y aves por usuario.
   * @param {string} [userId] - Identificador del usuario para filtrar sus rutas.
   * @returns {Promise<IRoute[]>} Array de rutas con conteos calculados.
   */
  async findAll(userId?: string): Promise<IRoute[]> {
    const qb = this.routeRepository
      .createQueryBuilder('r')
      .leftJoin('r.sightings', 's')
      .select([
        'r.id AS id',
        'r.name AS name',
        'r.start_time AS start_time',
        'r.end_time AS end_time',
        'r.route_type AS route_type',
        'r.total_km AS total_km',
        'r.duration_mins AS duration_mins',
        'r.comments AS comments',
        'r.sync_status AS sync_status',
        'r.department_id AS department_id',
        'r.municipality_id AS municipality_id',
        'r.user_id AS user_id',
        'r.created_at AS created_at',
      ])
      .addSelect('COUNT(DISTINCT s.bird_id)', 'species_count')
      .addSelect('COALESCE(SUM(s.quantity), 0)', 'birds_count')
      .groupBy('r.id')
      .orderBy('r.start_time', 'DESC');

    if (userId) {
      qb.where('r.user_id = :userId', { userId });
    }

    interface RawRouteRow {
      id: string;
      name: string | null;
      start_time: string | Date;
      end_time: string | Date | null;
      route_type: string | null;
      total_km: number | string | null;
      duration_mins: number | string | null;
      comments: string | null;
      sync_status: string | null;
      department_id: number | null;
      municipality_id: number | null;
      user_id: string | null;
      created_at: string | Date;
      species_count: string | number;
      birds_count: string | number;
    }

    const rawRows = await qb.getRawMany<RawRouteRow>();

    return rawRows.map((row) => ({
      id: row.id,
      name: row.name ?? undefined,
      start_time:
        row.start_time instanceof Date
          ? row.start_time.toISOString()
          : String(row.start_time),
      end_time: row.end_time
        ? row.end_time instanceof Date
          ? row.end_time.toISOString()
          : String(row.end_time)
        : undefined,
      route_type: row.route_type ?? 'desplazamiento',
      total_km: Number(row.total_km) || 0,
      duration_mins: Number(row.duration_mins) || 0,
      comments: row.comments ?? undefined,
      sync_status: (row.sync_status as 'synced' | 'pending_sync') ?? 'synced',
      status: row.end_time ? 'COMPLETED' : 'DRAFT',
      department_id: row.department_id ? Number(row.department_id) : undefined,
      municipality_id: row.municipality_id
        ? Number(row.municipality_id)
        : undefined,
      species_count: parseInt(String(row.species_count || '0'), 10),
      birds_count: parseInt(String(row.birds_count || '0'), 10),
    }));
  }
}
