import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum MedalConditionType {
  ACCOUNT_CREATED = 'ACCOUNT_CREATED',
  DAYS_ACTIVE = 'DAYS_ACTIVE',
  BIRD_COUNT = 'BIRD_COUNT',
}

/**
 * @sdd
 * @description Entidad para el catálogo de medallas de la aplicación.
 * @io Persiste los requerimientos para que un usuario desbloquee una medalla.
 */
@Entity('medals')
export class MedalEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column({ default: 'assets/imgs/medals/default.png' })
  iconUrl: string;

  @Column({
    type: 'enum',
    enum: MedalConditionType,
  })
  condition_type: MedalConditionType;

  @Column('int')
  condition_value: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  last_modified: Date;
}
