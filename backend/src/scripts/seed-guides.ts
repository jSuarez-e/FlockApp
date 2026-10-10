import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GuideEntity } from '../infrastructure/entities/guide.entity';
import { Repository } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const guideRepo = app.get<Repository<GuideEntity>>(
    getRepositoryToken(GuideEntity),
  );

  console.log('🌱 Iniciando carga de Guías Maestros (Seeder)...');

  const guidesData = [
    {
      fullName: 'Carlos Avendaño',
      location: 'Minca, Magdalena',
      specialty: 'Aves Endémicas y Fotografía',
      rating: 4.9,
      photoUrl:
        'https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png',
      details:
        'Guía experto con más de 10 años recorriendo la Sierra Nevada de Santa Marta. Especializado en el Periquito de Santa Marta.',
    },
    {
      fullName: 'Marta Rincón',
      location: 'Cali, Valle del Cauca',
      specialty: 'Rutas de Montaña',
      rating: 4.7,
      photoUrl:
        'https://cdn.pixabay.com/photo/2021/01/17/09/11/woman-5924366_1280.jpg',
      details:
        'Especialista en observación de tangaras y colibríes en el Km 18 y San Antonio.',
    },
    {
      fullName: 'Jorge Echeverri',
      location: 'Medellín, Antioquia',
      specialty: 'Ciclismo y Aviturismo',
      rating: 4.5,
      photoUrl:
        'https://cdn.pixabay.com/photo/2016/11/18/19/07/happy-1836445_1280.jpg',
      details:
        'Combina recorridos en bicicleta de montaña con la observación de aves locales.',
    },
  ];

  for (const g of guidesData) {
    const exists = await guideRepo.findOne({
      where: { full_name: g.fullName, sql_deleted: false },
    });
    if (!exists) {
      await guideRepo.save(
        guideRepo.create({
          id: crypto.randomUUID(),
          full_name: g.fullName,
          location: g.location,
          specialty: g.specialty,
          rating: g.rating,
          photo_url: g.photoUrl,
          details: g.details,
        }),
      );
      console.log(`✅ Guía creado: ${g.fullName}`);
    } else {
      console.log(`⚠️ Guía ya existe: ${g.fullName}`);
    }
  }

  console.log('✅ Carga de guías finalizada exitosamente.');
  await app.close();
}

void bootstrap();
