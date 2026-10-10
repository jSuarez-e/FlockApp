import { Entity, PrimaryColumn, Column, UpdateDateColumn } from 'typeorm';

class BaseTaxonomyEntity {
  @PrimaryColumn({ type: 'int' })
  id: number;

  @Column({ type: 'text' })
  description: string;

  @UpdateDateColumn()
  last_modified: Date;

  @Column({ type: 'boolean', default: false })
  sql_deleted: boolean;
}

@Entity('orders')
export class OrderEntity extends BaseTaxonomyEntity {}

@Entity('conservation_statuses')
export class ConservationStatusEntity extends BaseTaxonomyEntity {
  @Column({ type: 'text' })
  english_description: string;

  @Column({ type: 'text' })
  convention: string;

  @Column({ type: 'text' })
  image_url: string;
}

@Entity('habitats')
export class HabitatEntity extends BaseTaxonomyEntity {
  @Column({ type: 'text' })
  english_description: string;
}

@Entity('residency_types')
export class ResidencyTypeEntity extends BaseTaxonomyEntity {}

@Entity('feeding_types')
export class FeedingTypeEntity extends BaseTaxonomyEntity {}

@Entity('behavior_types')
export class BehaviorTypeEntity extends BaseTaxonomyEntity {}

@Entity('beak_morphologies')
export class BeakMorphologyEntity extends BaseTaxonomyEntity {}

@Entity('wing_morphologies')
export class WingMorphologyEntity extends BaseTaxonomyEntity {}

@Entity('tail_morphologies')
export class TailMorphologyEntity extends BaseTaxonomyEntity {}

@Entity('leg_morphologies')
export class LegMorphologyEntity extends BaseTaxonomyEntity {}

@Entity('additional_info')
export class AdditionalInfoEntity extends BaseTaxonomyEntity {}

@Entity('families')
export class FamilyEntity extends BaseTaxonomyEntity {
  @Column({ type: 'int' })
  order_id: number;

  @Column({ type: 'int', default: 0 })
  total_birds: number;

  @Column({ type: 'text', nullable: true })
  bird_types: string;
}

@Entity('bird_departments')
export class BirdDepartmentEntity {
  @PrimaryColumn({ type: 'int' })
  id: number;

  @Column({ type: 'int' })
  bird_id: number;

  @Column({ type: 'int' })
  department_id: number;

  @UpdateDateColumn()
  last_modified: Date;

  @Column({ type: 'boolean', default: false })
  sql_deleted: boolean;
}
