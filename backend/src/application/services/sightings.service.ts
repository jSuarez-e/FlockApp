/**
 * @sdd
 * @description Sightings Service using PostGIS for Spatial Queries.
 * @io Execute PostGIS ST_Distance or similar logic.
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RouteSightingEntity } from '../../infrastructure/entities/route-sighting.entity';

interface RawSightingQueryRow {
  user_id?: string;
  user_first_name?: string;
  user_last_name?: string;
  user_username?: string;
  user_avatar_url?: string;
  bird_id?: number;
  bird_scientific_name?: string;
  bird_english_name?: string;
  bird_common_name?: string;
}

@Injectable()
export class SightingsService {
  constructor(
    @InjectRepository(RouteSightingEntity)
    private readonly routeSightingRepo: Repository<RouteSightingEntity>,
  ) {}

  async searchSightings(
    birdId: string,
    startDate: string,
    endDate: string,
    departmentId?: string,
  ) {
    const query = this.routeSightingRepo
      .createQueryBuilder('sighting')
      .leftJoinAndSelect('sighting.route', 'route')
      .leftJoin('users', 'user', 'user.id = route.user_id')
      .leftJoin('birds', 'bird', 'bird.id = CAST(sighting.bird_id AS INTEGER)')
      .addSelect([
        'user.id AS user_id',
        'user.firstName AS user_first_name',
        'user.lastName AS user_last_name',
        'user.username AS user_username',
        'user.avatarUrl AS user_avatar_url',
        'bird.id AS bird_id',
        'bird.scientific_name AS bird_scientific_name',
        'bird.english_name AS bird_english_name',
        'bird.common_name AS bird_common_name',
      ])
      // Solo tomamos datos de rutas que han sido sincronizadas (enviadas definitivas)
      .where('route.sync_status = :status', { status: 'synced' })
      .limit(100);

    if (birdId) {
      query.andWhere('sighting.bird_id = :birdId', { birdId });
    }

    if (departmentId && departmentId !== 'all') {
      query.andWhere('route.department_id = :departmentId', { departmentId });
    }

    if (startDate) {
      query.andWhere('sighting.timestamp >= :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('sighting.timestamp <= :endDate', { endDate });
    }

    const { entities, raw } = await query.getRawAndEntities();
    const rawRows = raw as unknown as RawSightingQueryRow[];

    return entities.map((sighting, idx) => {
      let lat = 0,
        lng = 0;
      const loc = sighting.location as unknown as { coordinates?: number[] };
      if (loc && loc.coordinates) {
        lng = loc.coordinates[0];
        lat = loc.coordinates[1];
      }

      const r = rawRows[idx] || {};
      const firstName = r.user_first_name || '';
      const lastName = r.user_last_name || '';
      const userName =
        `${firstName} ${lastName}`.trim() ||
        r.user_username ||
        'Observador Comunitario';
      const userPhoto = r.user_avatar_url || '';

      const scientificName = r.bird_scientific_name || '';
      const englishName = r.bird_english_name || '';
      const commonName = r.bird_common_name || '';
      const birdName = scientificName
        ? `${scientificName} (${englishName || commonName})`
        : sighting.bird_id
          ? `Ave #${sighting.bird_id}`
          : 'Ave registrada';

      return {
        id: sighting.id,
        birdId: sighting.bird_id,
        birdName,
        scientificName,
        englishName,
        commonName,
        date: sighting.timestamp
          ? new Date(sighting.timestamp).toISOString().split('T')[0]
          : '',
        time: sighting.timestamp
          ? new Date(sighting.timestamp)
              .toISOString()
              .split('T')[1]
              .substring(0, 5)
          : '',
        location: { type: 'Point', coordinates: [lng, lat] },
        user: {
          id: r.user_id || undefined,
          name: userName,
          photoUrl: userPhoto,
        },
      };
    });
  }
}
