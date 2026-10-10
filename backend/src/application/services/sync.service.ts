/**
 * @sdd
 * @description Sync Service to fetch catalog delta updates.
 * @io Injects Repositories and returns DTO mapping to ISyncCatalogsResponse.
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, DataSource } from 'typeorm';
import { GuideEntity } from '../../infrastructure/entities/guide.entity';
import { SiteEntity } from '../../infrastructure/entities/site.entity';
import { SiteBirdEntity } from '../../infrastructure/entities/site-bird.entity';
import { RouteEntity } from '../../infrastructure/entities/route.entity';
import { RouteSightingEntity } from '../../infrastructure/entities/route-sighting.entity';
import { SiteServiceEntity } from '../../infrastructure/entities/site-service.entity';
import { BirdEntity } from '../../infrastructure/entities/bird.entity';
import { DepartmentEntity } from '../../infrastructure/entities/department.entity';
import { MunicipalityEntity } from '../../infrastructure/entities/municipality.entity';
import { ISyncRoutesBulkPayload } from '../../../../shared/models/routes.interface';

@Injectable()
export class SyncService {
  constructor(
    @InjectRepository(GuideEntity)
    private readonly guideRepo: Repository<GuideEntity>,
    @InjectRepository(SiteEntity)
    private readonly siteRepo: Repository<SiteEntity>,
    @InjectRepository(SiteBirdEntity)
    private readonly siteBirdRepo: Repository<SiteBirdEntity>,
    @InjectRepository(BirdEntity)
    private readonly birdRepo: Repository<BirdEntity>,
    @InjectRepository(DepartmentEntity)
    private readonly departmentRepo: Repository<DepartmentEntity>,
    @InjectRepository(MunicipalityEntity)
    private readonly municipalityRepo: Repository<MunicipalityEntity>,
    @InjectRepository(SiteServiceEntity)
    private readonly siteServiceRepo: Repository<SiteServiceEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async getCatalogsSince(lastSync?: number | string) {
    let targetDate: Date;
    if (!lastSync || lastSync === '0' || lastSync === 0) {
      targetDate = new Date(0);
    } else if (typeof lastSync === 'number' || !isNaN(Number(lastSync))) {
      const num = Number(lastSync);
      const ms = num > 1e11 ? num : num * 1000;
      // Ventana de seguridad de 60 segundos para evitar exclusión por desface de reloj cliente/servidor
      targetDate = new Date(Math.max(0, ms - 60000));
    } else {
      const parsed = new Date(lastSync);
      targetDate = isNaN(parsed.getTime())
        ? new Date(0)
        : new Date(Math.max(0, parsed.getTime() - 60000));
    }

    const [
      guides,
      sites,
      siteBirds,
      departments,
      municipalities,
      birds,
      siteServices,
    ] = await Promise.all([
      this.guideRepo.find({
        where: { last_modified: MoreThanOrEqual(targetDate) },
      }),
      this.siteRepo.find({
        where: { last_modified: MoreThanOrEqual(targetDate) },
      }),
      this.siteBirdRepo.find({
        where: { last_modified: MoreThanOrEqual(targetDate) },
      }),
      this.departmentRepo.find({
        where: { last_modified: MoreThanOrEqual(targetDate) },
      }),
      this.municipalityRepo.find({
        where: { last_modified: MoreThanOrEqual(targetDate) },
      }),
      this.birdRepo.find({
        where: { last_modified: MoreThanOrEqual(targetDate) },
      }),
      this.siteServiceRepo
        .find({
          where: { last_modified: MoreThanOrEqual(targetDate) },
        })
        .catch(() => []),
    ]);

    // Map guides to frontend expected format
    const mappedGuides = guides.map((g: GuideEntity) => ({
      ...g,
      fullName: g.full_name,
      photoUrl: g.photo_url,
      last_modified: g.last_modified
        ? Math.floor(new Date(g.last_modified).getTime() / 1000)
        : 0,
    }));

    // Map sites to frontend expected format
    const mappedSites = sites.map((s: SiteEntity) => {
      const locationCoords = (
        s.location as unknown as { coordinates?: [number, number] }
      )?.coordinates;
      const hasCoords =
        locationCoords &&
        typeof locationCoords[1] === 'number' &&
        typeof locationCoords[0] === 'number' &&
        (Math.abs(locationCoords[1]) > 0.0001 ||
          Math.abs(locationCoords[0]) > 0.0001);
      const lat = hasCoords ? locationCoords[1] : null;
      const lng = hasCoords ? locationCoords[0] : null;
      return {
        ...s,
        photoUrl: s.cover_url || s.logo_url || '',
        location: lat !== null && lng !== null ? { lat, lng } : null,
        last_modified: s.last_modified
          ? Math.floor(new Date(s.last_modified).getTime() / 1000)
          : 0,
      };
    });

    const mappedSiteBirds = siteBirds.map((sb: SiteBirdEntity) => ({
      site_id: sb.site_id,
      bird_id: String(sb.bird_id),
      last_modified: sb.last_modified
        ? Math.floor(new Date(sb.last_modified).getTime() / 1000)
        : 0,
      sql_deleted: sb.sql_deleted,
    }));

    const mappedBirds = birds.map((b: BirdEntity) => ({
      ...b,
      last_modified: b.last_modified
        ? Math.floor(new Date(b.last_modified).getTime() / 1000)
        : 0,
    }));

    return {
      guides: mappedGuides,
      sites: mappedSites,
      site_birds: mappedSiteBirds,
      site_services: siteServices.map((ss: SiteServiceEntity) => ({
        id: ss.id,
        site_id: ss.site_id,
        type: ss.type,
        name: ss.name,
        description: ss.description,
        photoUrl: ss.photo_url,
        price: ss.price,
        last_modified: ss.last_modified
          ? Math.floor(new Date(ss.last_modified).getTime() / 1000)
          : 0,
        sql_deleted: ss.sql_deleted,
      })),
      departments: departments.map((d: DepartmentEntity) => ({
        id: d.id,
        name: d.name,
        sql_deleted: d.sql_deleted,
      })),
      municipalities: municipalities.map((m: MunicipalityEntity) => ({
        id: m.id,
        department_id: m.department_id,
        name: m.name,
        sql_deleted: m.sql_deleted,
      })),
      birds: mappedBirds,
      timestamp: Math.floor(Date.now() / 1000),
    };
  }

  /**
   * @description Procesa de forma transaccional el volcado masivo de rutas y avistamientos con soporte espacial.
   * @param payload DTO con el array de rutas y sightings anidados.
   * @param userId Identificador del usuario que sincroniza los datos.
   * @returns Resultado del procesamiento.
   */
  async processRoutesBulkSync(payload: ISyncRoutesBulkPayload, userId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const route of payload.routes) {
        let parsedPath = route.path_geojson
          ? (JSON.parse(route.path_geojson) as {
              type?: string;
              coordinates?: unknown[];
            })
          : null;

        // PostGIS LineString rechaza geometrías con menos de 2 puntos
        if (
          parsedPath &&
          parsedPath.type === 'LineString' &&
          (!parsedPath.coordinates || parsedPath.coordinates.length < 2)
        ) {
          parsedPath = null;
        }

        const routeEntity = queryRunner.manager.create(RouteEntity, {
          id: route.id,
          start_time: new Date(route.start_time),
          end_time: route.end_time ? new Date(route.end_time) : null,
          route_type: route.route_type,
          total_km: route.total_km,
          duration_mins: route.duration_mins,
          name: route.name,
          comments: route.comments,
          department_id: route.department_id,
          municipality_id: route.municipality_id,
          path: parsedPath,
          user_id: userId,
          sync_status: 'synced',
        });

        await queryRunner.manager.save(routeEntity);

        if (route.sightings && route.sightings.length > 0) {
          const sightingEntities = route.sightings.map((s) => {
            return queryRunner.manager.create(RouteSightingEntity, {
              id: s.id,
              route_id: route.id,
              bird_id: s.bird_id,
              location: { type: 'Point', coordinates: [s.lng, s.lat] },
              timestamp: new Date(s.timestamp),
              quantity: s.quantity,
              sync_status: 'synced',
            });
          });
          await queryRunner.manager.save(sightingEntities);
        }
      }

      // 2. Procesar Usuarios Pendientes (Offline-First Profiles)
      if (payload.users && payload.users.length > 0) {
        // Obtenemos dinámicamente la entidad (UserEntity) sin forzar imports duros
        // asumiendo un esquema base. Depende de TypeORM y el nombre 'UserEntity' exportado.
        const userRepository = queryRunner.manager.getRepository('UserEntity');
        for (const user of payload.users) {
          const existing = await userRepository.findOne({
            where: { id: user.id },
          });
          if (existing) {
            Object.assign(existing, user);
            await userRepository.save(existing);
          }
        }
      }

      await queryRunner.commitTransaction();
      return { success: true, processed_routes: payload.routes.length };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
