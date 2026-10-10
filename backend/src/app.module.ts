import { Module, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Entidades
import { UserEntity } from './infrastructure/entities/user.entity';
import { PasswordResetEntity } from './infrastructure/entities/password-reset.entity';

// Módulos de Funcionalidad
import { AuthModule } from './infrastructure/modules/auth.module';
import { UsersModule } from './infrastructure/modules/users.module';
import { LocationsModule } from './infrastructure/modules/locations.module';
import { DepartmentEntity } from './infrastructure/entities/department.entity';
import { MunicipalityEntity } from './infrastructure/entities/municipality.entity';
import { GuideEntity } from './infrastructure/entities/guide.entity';
import { SiteEntity } from './infrastructure/entities/site.entity';
import { SiteBirdEntity } from './infrastructure/entities/site-bird.entity';
import { RouteEntity } from './infrastructure/entities/route.entity';
import { RouteSightingEntity } from './infrastructure/entities/route-sighting.entity';

import { CatalogsModule } from './infrastructure/modules/catalogs.module';
import { GuidesModule } from './infrastructure/modules/guides.module';
import { FeedModule } from './infrastructure/modules/feed.module';
import { MedalsModule } from './infrastructure/modules/medals.module';
import { RoutesModule } from './infrastructure/modules/routes.module';
import { FeedPostEntity } from './infrastructure/entities/feed-post.entity';
import { MedalEntity } from './infrastructure/entities/medal.entity';
import { UserMedalEntity } from './infrastructure/entities/user-medal.entity';
import { DatabaseBootstrapService } from './infrastructure/database/database-bootstrap.service';

@Module({
  imports: [
    // 1. Carga de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 2. Conexión Global a PostgreSQL + PostGIS
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbTarget = config.get<string>('DB_TARGET', 'auto');
        const databaseUrl = config.get<string>('DATABASE_URL');
        const useNeon =
          dbTarget === 'neon' || (dbTarget !== 'local' && Boolean(databaseUrl));

        if (useNeon && databaseUrl) {
          Logger.log(
            '🌐 [Database] Conectando a PostgreSQL en la NUBE (Neon Serverless)...',
            'DatabaseModule',
          );
        } else {
          Logger.log(
            `💻 [Database] Conectando a PostgreSQL LOCAL (${config.get<string>('DB_HOST') || 'localhost'}:${config.get<number>('DB_PORT') || 5432})...`,
            'DatabaseModule',
          );
        }

        return {
          type: 'postgres',
          ...(useNeon && databaseUrl
            ? {
                url: databaseUrl,
                ssl: { rejectUnauthorized: false },
              }
            : {
                host: config.get<string>('DB_HOST') || 'localhost',
                port: Number(config.get<number>('DB_PORT')) || 5432,
                username: config.get<string>('DB_USERNAME') || 'postgres',
                password: config.get<string>('DB_PASSWORD') || '',
                database: config.get<string>('DB_DATABASE') || 'aviturismo_db',
              }),
          entities: [
            UserEntity,
            PasswordResetEntity,
            DepartmentEntity,
            MunicipalityEntity,
            GuideEntity,
            SiteEntity,
            SiteBirdEntity,
            FeedPostEntity,
            MedalEntity,
            UserMedalEntity,
            RouteEntity,
            RouteSightingEntity,
          ],
          autoLoadEntities: true,
          synchronize: config.get<string>('DB_SYNC') === 'true',
          logging: config.get<string>('NODE_ENV') === 'development',
          useUTC: true, // Crucial para la sincronización basada en timestamps
        };
      },
    }),

    // 3. Importamos el módulo de autenticación (Él se encarga de sus controladores y servicios)
    AuthModule,
    UsersModule,
    LocationsModule,
    CatalogsModule,
    FeedModule,
    GuidesModule,
    MedalsModule,
    RoutesModule,
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseBootstrapService],
})
export class AppModule {}
