import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entidades (Dominios)
import { DepartmentEntity } from './../../infrastructure/entities/department.entity';
import { MunicipalityEntity } from './../../infrastructure/entities/municipality.entity';

// Servicios y Controladores (Aplicación e Infraestructura)
import { LocationsService } from './../../application/services/locations.service';
import { LocationsController } from './../../infrastructure/controllers/locations.controller';

/**
 * @module LocationsModule
 * @description Módulo encargado de registrar la geografía territorial normalizada.
 * Soluciona el error UnknownDependenciesException al registrar los repositorios necesarios.
 * @author Gemini (Orquestador SDD)
 */
@Module({
  imports: [
    /** * R5: Registro de Entidades para Inyección.
     * Al agregar ambas aquí, NestJS puede resolver 'DepartmentEntityRepository'
     * y 'MunicipalityEntityRepository' en el LocationsService.
     */
    TypeOrmModule.forFeature([DepartmentEntity, MunicipalityEntity]),
  ],
  controllers: [
    /** R2: Exposición de endpoints para consulta y seeding */
    LocationsController,
  ],
  providers: [
    /** R2: Lógica de negocio y persistencia */
    LocationsService,
  ],
  exports: [
    /** Exportamos el servicio por si otros módulos requieren validar IDs geográficos */
    LocationsService,
  ],
})
export class LocationsModule {}
