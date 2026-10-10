import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

/**
 * @class LocationEntity
 * @description Representa la estructura jerárquica de la división política.
 * @author Gemini (Orquestador SDD)
 */
@Entity('locations')
export class LocationEntity {
  /** * @description ID Primario manual.
   * R10: Se utiliza PrimaryColumn para preservar los IDs originales del JSON.
   */
  @PrimaryColumn()
  id: number;

  /** @description Nombre del Departamento o Municipio */
  @Column({ length: 100 })
  name: string;

  /** @description ID del nivel superior. NULL para Departamentos. */
  @Column({ type: 'int', nullable: true })
  parentId: number | null;

  /** @description Relación recursiva ascendente */
  @ManyToOne(() => LocationEntity, (location) => location.children, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parentId' })
  parent: LocationEntity;

  /** @description Relación recursiva descendente (Municipios hijos) */
  @OneToMany(() => LocationEntity, (location) => location.parent)
  children: LocationEntity[];
}
