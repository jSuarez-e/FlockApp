/**
 * @sdd
 * @description Module bundling Catalogs (Guides, Sites) and their sync logic.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuideEntity } from '../entities/guide.entity';
import { UserEntity } from '../entities/user.entity';
import { SiteEntity } from '../entities/site.entity';
import { SiteBirdEntity } from '../entities/site-bird.entity';
import { RouteSightingEntity } from '../entities/route-sighting.entity';
import { RouteEntity } from '../entities/route.entity';
import { SiteServiceEntity } from '../entities/site-service.entity';
import { SiteRatingEntity } from '../entities/site-rating.entity';
import { SyncService } from '../../application/services/sync.service';
import { SightingsService } from '../../application/services/sightings.service';
import { SitesService } from '../../application/services/sites.service';
import { BirdsService } from '../../application/services/birds.service';
import { SyncController } from '../controllers/sync.controller';
import { SightingsController } from '../controllers/sightings.controller';
import { SitesController } from '../controllers/sites.controller';
import { BirdsController } from '../controllers/birds.controller';
import { BirdEntity } from '../entities/bird.entity';
import { DepartmentEntity } from '../entities/department.entity';
import { MunicipalityEntity } from '../entities/municipality.entity';
import {
  OrderEntity,
  ConservationStatusEntity,
  HabitatEntity,
  ResidencyTypeEntity,
  FeedingTypeEntity,
  BehaviorTypeEntity,
  BeakMorphologyEntity,
  WingMorphologyEntity,
  TailMorphologyEntity,
  LegMorphologyEntity,
  AdditionalInfoEntity,
  FamilyEntity,
  BirdDepartmentEntity,
} from '../entities/taxonomy.entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GuideEntity,
      UserEntity,
      SiteEntity,
      SiteServiceEntity,
      SiteRatingEntity,
      SiteBirdEntity,
      RouteSightingEntity,
      RouteEntity,
      BirdEntity,
      DepartmentEntity,
      MunicipalityEntity,
      OrderEntity,
      ConservationStatusEntity,
      HabitatEntity,
      ResidencyTypeEntity,
      FeedingTypeEntity,
      BehaviorTypeEntity,
      BeakMorphologyEntity,
      WingMorphologyEntity,
      TailMorphologyEntity,
      LegMorphologyEntity,
      AdditionalInfoEntity,
      FamilyEntity,
      BirdDepartmentEntity,
    ]),
  ],
  controllers: [
    SyncController,
    SightingsController,
    SitesController,
    BirdsController,
  ],
  providers: [SyncService, SightingsService, SitesService, BirdsService],
  exports: [SyncService, SightingsService, SitesService, BirdsService],
})
export class CatalogsModule {}
