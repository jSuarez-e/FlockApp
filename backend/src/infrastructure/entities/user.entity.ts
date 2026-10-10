import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

export enum UserRole {
  PAJARERO = 'PAJARERO',
  PROVEEDOR = 'PROVEEDOR',
  BOTH = 'BOTH',
}

/**
 * @class UserEntity
 * @description Representación en base de datos del usuario FlockApp.
 */
@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column({ select: false })
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  username: string;

  // --- MULTIMEDIA ---
  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ nullable: true })
  coverUrl: string;

  // --- SOCIAL Y TERRITORIAL ---
  @Column({ nullable: true })
  department: string;

  @Column({ nullable: true })
  municipality: string;

  @Column({ nullable: true })
  instagram: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  // --- ROLES Y NEGOCIO ---
  @Column({ type: 'enum', enum: UserRole, default: UserRole.PAJARERO })
  role: UserRole;

  @Column({ nullable: true })
  businessName: string;

  @Column({ nullable: true })
  rnt: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  stats?: {
    speciesCount: number;
    sightingsCount: number;
    medalsCount: number;
    daysInApp: number;
    natureTimeMinutes: number;
  };

  medals?: Array<{
    id: string | number;
    name: string;
    description?: string;
    icon?: string;
    iconUrl?: string;
    earned: boolean;
    awarded_at?: Date | string;
  }>;
}
