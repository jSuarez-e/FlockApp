/**
 * @sdd
 * @description Route Sighting Entity mapped to PostgreSQL with PostGIS Geography.
 * @io Persisted to DB representing individual sightings within a tracking route.
 */
import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RouteEntity } from './route.entity';

@Entity('route_sightings')
export class RouteSightingEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  route_id: string;

  @Column()
  bird_id: string;

  @Index({ spatial: true })
  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  location: { type: string; coordinates: [number, number] } | null; // TypeORM GeoJSON format { type: "Point", coordinates: [lng, lat] }

  @Column({ type: 'timestamp' })
  timestamp: Date;

  @Column('int', { default: 1 })
  quantity: number;

  @Column({ default: 'synced' })
  sync_status: string;

  @ManyToOne(() => RouteEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'route_id' })
  route: RouteEntity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  last_modified: Date;
}
