/**
 * @sdd
 * - [Objetivo]: Servicio para consultar el Directorio de Guías (Online-Only).
 * - [I/O]: Expone búsquedas de base de datos hacia el controlador.
 * - [Edge Cases]: Validación básica de existencia en búsquedas por ID.
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GuideEntity } from '../../infrastructure/entities/guide.entity';
import { UserEntity } from '../../infrastructure/entities/user.entity';
import { UpdateGuideProfileDto } from '../../infrastructure/dtos/guide/update-guide-profile.dto';

@Injectable()
export class GuidesService {
  constructor(
    @InjectRepository(GuideEntity)
    private readonly guidesRepo: Repository<GuideEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
  ) {}

  async findAll() {
    return this.guidesRepo.find({
      where: { sql_deleted: false },
      order: { rating: 'DESC' },
    });
  }

  async findOne(id: string) {
    const guide = await this.guidesRepo.findOne({
      where: { id, sql_deleted: false },
    });
    if (!guide) {
      throw new NotFoundException(`Guía con ID ${id} no encontrado.`);
    }
    return guide;
  }

  /**
   * Obtiene el perfil del guía autenticado, combinando con datos de usuario si aún no existe en 'guides'.
   */
  async getMyProfile(userId: string) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    const guide = await this.guidesRepo.findOne({
      where: { id: userId, sql_deleted: false },
    });

    if (!guide) {
      if (!user) {
        return null;
      }
      const fullName =
        user.businessName ||
        `${user.firstName || ''} ${user.lastName || ''}`.trim();
      const location =
        user.department && user.municipality
          ? `${user.municipality}, ${user.department}`
          : user.department || '';

      return {
        id: user.id,
        fullName,
        location,
        specialty: '',
        details: user.bio || '',
        rating: 0,
        photoUrl: user.avatarUrl || '',
        coverUrl: user.coverUrl || '',
        phone: '',
        hasWhatsapp: true,
        instagram: user.instagram || '',
        website: '',
        email: user.email || '',
        languages: 'Español',
        rnt: user.rnt || '',
        isPublished: true,
        sql_deleted: false,
      };
    }

    return {
      id: guide.id,
      fullName: guide.full_name,
      location: guide.location,
      specialty: guide.specialty,
      rating: guide.rating,
      photoUrl: guide.photo_url || user?.avatarUrl || '',
      coverUrl: guide.cover_url || user?.coverUrl || '',
      details: guide.details,
      phone: guide.phone || '',
      hasWhatsapp: guide.has_whatsapp ?? true,
      instagram: guide.instagram || user?.instagram || '',
      website: guide.website || '',
      email: guide.email || user?.email || '',
      languages: guide.languages || 'Español',
      rnt: guide.rnt || user?.rnt || '',
      isPublished: guide.is_published ?? true,
      sql_deleted: guide.sql_deleted,
    };
  }

  async updateProfile(userId: string, dto: UpdateGuideProfileDto) {
    let guide = await this.guidesRepo.findOne({ where: { id: userId } });
    const locationStr = `${dto.municipality}, ${dto.department}`;

    if (!guide) {
      guide = this.guidesRepo.create({
        id: userId,
        full_name: dto.fullName,
        location: locationStr,
        specialty: dto.specialty,
        details: dto.details,
        rating: 0,
        phone: dto.phone || '',
        has_whatsapp: dto.hasWhatsapp ?? true,
        instagram: dto.instagram || '',
        website: dto.website || '',
        email: dto.email || '',
        languages: dto.languages || 'Español',
        rnt: dto.rnt || '',
        is_published: dto.isPublished ?? true,
        sql_deleted: false,
        last_modified: new Date(),
      });
    } else {
      guide.full_name = dto.fullName;
      guide.location = locationStr;
      guide.specialty = dto.specialty;
      guide.details = dto.details;
      if (dto.phone !== undefined) guide.phone = dto.phone;
      if (dto.hasWhatsapp !== undefined) guide.has_whatsapp = dto.hasWhatsapp;
      if (dto.instagram !== undefined) guide.instagram = dto.instagram;
      if (dto.website !== undefined) guide.website = dto.website;
      if (dto.email !== undefined) guide.email = dto.email;
      if (dto.languages !== undefined) guide.languages = dto.languages;
      if (dto.rnt !== undefined) guide.rnt = dto.rnt;
      if (dto.isPublished !== undefined) guide.is_published = dto.isPublished;
      guide.last_modified = new Date();
      guide.sql_deleted = false;
    }

    if (dto.photoUrl) {
      guide.photo_url = dto.photoUrl;
    }
    if (dto.coverUrl) {
      guide.cover_url = dto.coverUrl;
    }

    const savedGuide = await this.guidesRepo.save(guide);

    const userUpdate: Partial<UserEntity> = {
      department: dto.department,
      municipality: dto.municipality,
      businessName: dto.fullName,
    };
    if (dto.instagram !== undefined) {
      userUpdate.instagram = dto.instagram;
    }
    if (dto.rnt !== undefined) {
      userUpdate.rnt = dto.rnt;
    }
    await this.usersRepo.update(userId, userUpdate);

    return {
      id: savedGuide.id,
      fullName: savedGuide.full_name,
      location: savedGuide.location,
      specialty: savedGuide.specialty,
      rating: savedGuide.rating,
      photoUrl: savedGuide.photo_url,
      coverUrl: savedGuide.cover_url,
      details: savedGuide.details,
      phone: savedGuide.phone,
      hasWhatsapp: savedGuide.has_whatsapp,
      instagram: savedGuide.instagram,
      website: savedGuide.website,
      email: savedGuide.email,
      languages: savedGuide.languages,
      rnt: savedGuide.rnt,
      isPublished: savedGuide.is_published,
      sql_deleted: savedGuide.sql_deleted,
    };
  }
}
