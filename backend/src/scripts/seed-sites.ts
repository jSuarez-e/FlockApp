import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SiteEntity } from '../infrastructure/entities/site.entity';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const siteRepo = app.get<Repository<SiteEntity>>(
    getRepositoryToken(SiteEntity),
  );

  console.log('🌱 Iniciando carga de Sitios de Aviturismo (Seeder)...');

  const sitesData = [
    {
      name: 'Reserva Natural El Dorado',
      department: 'Magdalena',
      rating: 4.9,
      description:
        'Reserva icónica en la Sierra Nevada de Santa Marta, hogar de múltiples aves endémicas de Colombia.',
      location: {
        type: 'Point',
        coordinates: [-74.0538, 11.1018], // lng, lat
      },
    },
    {
      name: 'Km 18 y San Antonio',
      department: 'Valle del Cauca',
      rating: 4.8,
      description:
        'Lugar famoso cerca de Cali por sus comederos de colibríes y bandadas mixtas de tangaras.',
      location: {
        type: 'Point',
        coordinates: [-76.6277, 3.5186],
      },
    },
    {
      name: 'Jardín Botánico de Medellín',
      department: 'Antioquia',
      rating: 4.5,
      description:
        'Un oasis urbano excelente para iniciarse en el aviturismo, con especies comunes y migratorias.',
      location: {
        type: 'Point',
        coordinates: [-75.5658, 6.2704],
      },
    },
  ];

  for (const s of sitesData) {
    const exists = await siteRepo.findOne({
      where: { name: s.name, sql_deleted: false },
    });
    if (!exists) {
      await siteRepo.save(
        siteRepo.create({
          id: crypto.randomUUID(),
          name: s.name,
          department: s.department,
          rating: s.rating,
          description: s.description,
          location: s.location,
          last_modified: new Date(),
          sql_deleted: false,
        }),
      );
      console.log(`✅ Sitio creado: ${s.name}`);
    } else {
      console.log(`⚠️ Sitio ya existe: ${s.name}`);
    }
  }

  console.log('✅ Carga de Sitios finalizada exitosamente.');
  await app.close();
}

void bootstrap();
