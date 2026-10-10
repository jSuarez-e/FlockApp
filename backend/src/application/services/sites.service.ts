/**
 * @sdd
 * @description Service for managing Sites interactions.
 * @io Handles rating calculation and DB persistence.
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SiteEntity } from '../../infrastructure/entities/site.entity';
import { SiteRatingEntity } from '../../infrastructure/entities/site-rating.entity';
import { SiteServiceEntity } from '../../infrastructure/entities/site-service.entity';
import { SiteBirdEntity } from '../../infrastructure/entities/site-bird.entity';
import { UserEntity } from '../../infrastructure/entities/user.entity';
import { UpdateSiteProfileDto } from '../../infrastructure/dtos/site/update-site-profile.dto';
import { CreateSiteServiceDto } from '../../infrastructure/dtos/site/create-site-service.dto';
import { ISiteProviderProfile } from '../../../../shared/models/site-profile.interface';
import { randomUUID } from 'crypto';

@Injectable()
export class SitesService {
  constructor(
    @InjectRepository(SiteEntity)
    private readonly siteRepository: Repository<SiteEntity>,
    @InjectRepository(SiteRatingEntity)
    private readonly ratingRepository: Repository<SiteRatingEntity>,
    @InjectRepository(SiteServiceEntity)
    private readonly serviceRepository: Repository<SiteServiceEntity>,
    @InjectRepository(SiteBirdEntity)
    private readonly siteBirdRepository: Repository<SiteBirdEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  /**
   * Obtiene la lista completa de sitios de aviturismo públicos desde Postgres.
   * @returns Lista de sitios con ubicación y metadatos formateados.
   */
  async findAll() {
    const sites = await this.siteRepository.find({
      where: { sql_deleted: false },
      order: { rating: 'DESC' },
    });

    return sites.map((s) => {
      const coords = (
        s.location as unknown as { coordinates?: [number, number] }
      )?.coordinates;

      return {
        id: s.id,
        name: s.name,
        department: s.department,
        municipality: s.municipality,
        rating: s.rating || 5.0,
        description: s.description,
        cover_url: s.cover_url,
        logo_url: s.logo_url,
        photoUrl: s.cover_url || s.logo_url || '',
        contact_phone: s.contact_phone,
        contact_whatsapp: s.contact_whatsapp,
        website: s.website,
        instagram: s.instagram,
        facebook: s.facebook,
        has_bird_checklist: !!s.has_bird_checklist,
        location: coords ? { lat: coords[1], lng: coords[0] } : null,
        routeGeoJson: s.routeGeoJson,
        last_modified: s.last_modified ? s.last_modified.getTime() : undefined,
        sql_deleted: s.sql_deleted,
      };
    });
  }

  async addRating(
    siteId: string,
    userId: string,
    score: number,
    comment?: string,
  ) {
    const site = await this.siteRepository.findOne({ where: { id: siteId } });
    if (!site) throw new NotFoundException('Site not found');

    const rating = this.ratingRepository.create({
      id: randomUUID(),
      site_id: siteId,
      user_id: userId,
      score,
      comment,
      created_at: new Date(),
    });
    await this.ratingRepository.save(rating);

    // Recalcular el rating global del sitio
    const ratings = await this.ratingRepository.find({
      where: { site_id: siteId },
    });
    const avgScore =
      ratings.reduce((acc, curr) => acc + curr.score, 0) / ratings.length;

    site.rating = avgScore;
    site.last_modified = new Date();
    await this.siteRepository.save(site);

    return { success: true, siteRating: avgScore };
  }

  /**
   * Obtiene o inicializa el perfil de sitio del usuario en Modo Proveedor.
   * @param userId UUID del usuario autenticado.
   * @returns Perfil completo del sitio con sus servicios y cantidad de aves asociadas.
   */
  async getMySite(userId: string): Promise<ISiteProviderProfile> {
    let site = await this.siteRepository.findOne({
      where: { owner_id: userId, sql_deleted: false },
    });

    if (!site) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      const newSite = this.siteRepository.create({
        id: randomUUID(),
        owner_id: userId,
        name: user?.businessName || 'Mi Sitio de Aviturismo',
        department: user?.department || 'Valle del Cauca',
        municipality: user?.municipality || '',
        description:
          'Bienvenido a nuestro sitio de aviturismo y observación de aves.',
        rating: 5.0,
        has_bird_checklist: false,
        last_modified: new Date(),
        sql_deleted: false,
      });
      site = await this.siteRepository.save(newSite);
    }

    const services = await this.serviceRepository.find({
      where: { site_id: site.id, sql_deleted: false },
      order: { last_modified: 'DESC' },
    });

    const mappedServices = services.map((s) => ({
      id: s.id,
      site_id: s.site_id,
      type: s.type,
      name: s.name,
      description: s.description,
      price: s.price,
      photoUrl: s.photo_url,
      last_modified: s.last_modified ? s.last_modified.getTime() : undefined,
      sql_deleted: s.sql_deleted,
    }));

    const birdsCount = await this.siteBirdRepository.count({
      where: { site_id: site.id, sql_deleted: false },
    });

    const totalReviews = await this.ratingRepository.count({
      where: { site_id: site.id },
    });

    return {
      id: site.id,
      owner_id: site.owner_id,
      name: site.name,
      department: site.department,
      municipality: site.municipality,
      description: site.description,
      cover_url: site.cover_url,
      logo_url: site.logo_url,
      contact_phone: site.contact_phone,
      contact_whatsapp: site.contact_whatsapp,
      website: site.website,
      instagram: site.instagram,
      facebook: site.facebook,
      rating: site.rating || 5.0,
      total_reviews: totalReviews,
      has_bird_checklist: !!site.has_bird_checklist,
      services: mappedServices,
      birds_count: birdsCount,
      location: site.location
        ? {
            lat: site.location.coordinates[1],
            lng: site.location.coordinates[0],
          }
        : null,
    };
  }

  /**
   * Actualiza los datos del sitio propio del proveedor autenticado.
   * @param userId UUID del usuario.
   * @param dto Datos actualizados del sitio.
   * @returns Perfil actualizado del sitio.
   */
  async updateMySite(
    userId: string,
    dto: UpdateSiteProfileDto,
  ): Promise<ISiteProviderProfile> {
    let site = await this.siteRepository.findOne({
      where: { owner_id: userId, sql_deleted: false },
    });

    if (!site) {
      await this.getMySite(userId);
      site = await this.siteRepository.findOne({
        where: { owner_id: userId, sql_deleted: false },
      });
    }

    if (!site) {
      throw new NotFoundException('Sitio no encontrado para este proveedor.');
    }

    site.name = dto.name;
    if (dto.department !== undefined) site.department = dto.department;
    if (dto.municipality !== undefined) site.municipality = dto.municipality;
    if (dto.description !== undefined) site.description = dto.description;
    if (dto.cover_url !== undefined) site.cover_url = dto.cover_url;
    if (dto.logo_url !== undefined) site.logo_url = dto.logo_url;
    if (dto.contact_phone !== undefined) site.contact_phone = dto.contact_phone;
    if (dto.contact_whatsapp !== undefined) {
      site.contact_whatsapp = dto.contact_whatsapp;
    }
    if (dto.website !== undefined) site.website = dto.website;
    if (dto.instagram !== undefined) site.instagram = dto.instagram;
    if (dto.facebook !== undefined) site.facebook = dto.facebook;
    if (dto.has_bird_checklist !== undefined) {
      site.has_bird_checklist = dto.has_bird_checklist;
    }
    if (
      dto.latitude !== undefined &&
      dto.longitude !== undefined &&
      dto.latitude !== null &&
      dto.longitude !== null
    ) {
      site.location = {
        type: 'Point',
        coordinates: [dto.longitude, dto.latitude],
      };
    }
    site.last_modified = new Date();

    await this.siteRepository.save(site);
    return this.getMySite(userId);
  }

  /**
   * Crea un producto o servicio ofrecido por el sitio del proveedor.
   * @param userId UUID del proveedor.
   * @param dto Datos del servicio o producto.
   * @returns Entidad del servicio creado.
   */
  async addService(userId: string, dto: CreateSiteServiceDto) {
    const site = await this.siteRepository.findOne({
      where: { owner_id: userId, sql_deleted: false },
    });
    if (!site) {
      throw new NotFoundException('Sitio no encontrado para este proveedor.');
    }

    const service = this.serviceRepository.create({
      id: randomUUID(),
      site_id: site.id,
      type: dto.type,
      name: dto.name,
      description: dto.description,
      price: dto.price,
      photo_url: dto.photo_url,
      last_modified: new Date(),
      sql_deleted: false,
    });

    return this.serviceRepository.save(service);
  }

  /**
   * Elimina lógicamente un servicio o producto del sitio.
   * @param userId UUID del proveedor.
   * @param serviceId ID del servicio a eliminar.
   * @returns Resultado booleano de la operación.
   */
  async deleteService(userId: string, serviceId: string) {
    const site = await this.siteRepository.findOne({
      where: { owner_id: userId, sql_deleted: false },
    });
    if (!site) {
      throw new NotFoundException('Sitio no encontrado para este proveedor.');
    }

    const service = await this.serviceRepository.findOne({
      where: { id: serviceId, site_id: site.id, sql_deleted: false },
    });
    if (!service) {
      throw new NotFoundException('Servicio no encontrado.');
    }

    service.sql_deleted = true;
    service.last_modified = new Date();
    await this.serviceRepository.save(service);

    return { success: true };
  }

  /**
   * Obtiene la lista de IDs de aves asociadas al checklist del sitio.
   * @param userId UUID del proveedor.
   * @returns Arreglo de IDs numéricos de aves.
   */
  async getMySiteBirds(userId: string): Promise<number[]> {
    const site = await this.siteRepository.findOne({
      where: { owner_id: userId, sql_deleted: false },
    });
    if (!site) return [];

    const records = await this.siteBirdRepository.find({
      where: { site_id: site.id, sql_deleted: false },
    });
    return records.map((r) => r.bird_id);
  }

  /**
   * Sincroniza en bloque el checklist de aves del sitio.
   * @param userId UUID del proveedor.
   * @param birdIds Arreglo de IDs numéricos de aves seleccionadas.
   * @returns Cantidad de aves sincronizadas.
   */
  async syncMySiteBirds(
    userId: string,
    birdIds: number[],
  ): Promise<{ count: number }> {
    const site = await this.siteRepository.findOne({
      where: { owner_id: userId, sql_deleted: false },
    });
    if (!site) {
      throw new NotFoundException('Sitio no encontrado para este proveedor.');
    }

    await this.siteBirdRepository.update(
      { site_id: site.id },
      { sql_deleted: true, last_modified: new Date() },
    );

    for (const birdId of birdIds) {
      let record = await this.siteBirdRepository.findOne({
        where: { site_id: site.id, bird_id: birdId },
      });
      if (record) {
        record.sql_deleted = false;
        record.last_modified = new Date();
      } else {
        record = this.siteBirdRepository.create({
          site_id: site.id,
          bird_id: birdId,
          sql_deleted: false,
          last_modified: new Date(),
        });
      }
      await this.siteBirdRepository.save(record);
    }

    site.has_bird_checklist = birdIds.length > 0;
    site.last_modified = new Date();
    await this.siteRepository.save(site);

    return { count: birdIds.length };
  }

  /**
   * Obtiene el detalle público y completo de un sitio para la vista pajarera.
   * @param siteId ID del sitio.
   */
  async getSiteDetail(siteId: string) {
    const site = await this.siteRepository.findOne({
      where: { id: siteId, sql_deleted: false },
    });
    if (!site) {
      throw new NotFoundException('Sitio no encontrado');
    }

    const services = await this.serviceRepository.find({
      where: { site_id: site.id, sql_deleted: false },
      order: { last_modified: 'DESC' },
    });

    const mappedServices = services.map((s) => ({
      id: s.id,
      site_id: s.site_id,
      type: s.type,
      name: s.name,
      description: s.description,
      price: s.price,
      photoUrl: s.photo_url,
      last_modified: s.last_modified ? s.last_modified.getTime() : undefined,
      sql_deleted: s.sql_deleted,
    }));

    const siteBirds = await this.siteBirdRepository.find({
      where: { site_id: site.id, sql_deleted: false },
    });
    const birdIds = siteBirds.map((sb) => sb.bird_id);
    const birdsCount = siteBirds.length;

    const totalReviews = await this.ratingRepository.count({
      where: { site_id: site.id },
    });

    const coords = (
      site.location as unknown as { coordinates?: [number, number] }
    )?.coordinates;

    return {
      id: site.id,
      owner_id: site.owner_id,
      name: site.name,
      department: site.department,
      municipality: site.municipality,
      description: site.description,
      cover_url: site.cover_url,
      logo_url: site.logo_url,
      photoUrl: site.cover_url || site.logo_url || '',
      contact_phone: site.contact_phone,
      contact_whatsapp: site.contact_whatsapp,
      website: site.website,
      instagram: site.instagram,
      facebook: site.facebook,
      rating: site.rating || 5.0,
      total_reviews: totalReviews,
      has_bird_checklist: !!site.has_bird_checklist,
      services: mappedServices,
      birds_count: birdsCount,
      bird_ids: birdIds,
      location: coords ? { lat: coords[1], lng: coords[0] } : null,
    };
  }

  /**
   * Obtiene el listado de IDs de aves asociadas a un sitio público.
   * @param siteId ID del sitio.
   * @returns Arreglo de IDs numéricos de aves.
   */
  async getSiteBirds(siteId: string): Promise<number[]> {
    const records = await this.siteBirdRepository.find({
      where: { site_id: siteId, sql_deleted: false },
    });
    return records.map((r) => r.bird_id);
  }
}
