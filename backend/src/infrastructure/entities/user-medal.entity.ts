import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { MedalEntity } from './medal.entity';

/**
 * @sdd
 * @description Entidad pivote para registrar las medallas ganadas por un usuario.
 * @io Relaciona UserEntity con MedalEntity.
 */
@Entity('user_medals')
@Index(['user_id', 'medal_id'], { unique: true })
export class UserMedalEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @Column('uuid')
  medal_id: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => MedalEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'medal_id' })
  medal: MedalEntity;

  @CreateDateColumn()
  awarded_at: Date;
}
