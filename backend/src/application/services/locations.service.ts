import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DepartmentEntity } from './../../infrastructure/entities/department.entity';
import { MunicipalityEntity } from './../../infrastructure/entities/municipality.entity';
import { IReverseGeocodeResponse } from '../../../../shared/models/locations.interface';

/**
 * Estructura de dirección de respuesta de OpenStreetMap Nominatim.
 */
interface NominatimAddress {
  state?: string;
  city?: string;
  town?: string;
  municipality?: string;
  county?: string;
  village?: string;
  country?: string;
  country_code?: string;
}

/**
 * Estructura raíz de respuesta de OpenStreetMap Nominatim.
 */
interface NominatimResponse {
  address?: NominatimAddress;
  error?: string;
}

/**
 * @interface SeedPayload
 * @description Contrato estricto para los datos del Seeding (R5).
 */
interface SeedPayload {
  name: 'departamentos' | 'municipios';
  values: (string | number)[][];
}

/**
 * @class LocationsService
 * @description Orquestador de la lógica territorial bajo esquema normalizado.
 */
@Injectable()
export class LocationsService {
  private readonly logger = new Logger(LocationsService.name);
  private readonly reverseCache = new Map<string, IReverseGeocodeResponse>();

  constructor(
    @InjectRepository(DepartmentEntity)
    private readonly deptRepo: Repository<DepartmentEntity>,
    @InjectRepository(MunicipalityEntity)
    private readonly muniRepo: Repository<MunicipalityEntity>,
  ) {}

  /**
   * @method getDepartments
   * @description Obtiene la lista completa de departamentos.
   */
  async getDepartments(): Promise<DepartmentEntity[]> {
    return this.deptRepo.find({ order: { name: 'ASC' } });
  }

  /**
   * @method getMunicipalities
   * @description Obtiene los municipios vinculados a un departamento.
   * @param {number} departmentId - ID del departamento padre.
   */
  async getMunicipalities(departmentId: number): Promise<MunicipalityEntity[]> {
    return this.muniRepo.find({
      where: { department_id: departmentId },
      order: { name: 'ASC' },
    });
  }

  /**
   * @method clearDatabase
   * @description Limpia ambas tablas para garantizar una carga atómica.
   */
  async clearDatabase(): Promise<void> {
    await this.muniRepo.query('DELETE FROM municipalities');
    await this.deptRepo.query('DELETE FROM departments');
    this.logger.warn('Tablas de geografía normalizada reseteadas.');
  }

  /**
   * @method seedFromJSON
   * @description Procesa los datos del JSON y los distribuye en las tablas.
   * R3: Elimina la colisión de IDs al segmentar los repositorios.
   */
  async seedFromJSON(payload: SeedPayload): Promise<void> {
    const isDept = payload.name === 'departamentos';
    this.logger.log(`Iniciando carga de ${payload.name}...`);

    for (const row of payload.values) {
      const id = Number(row[0]);
      const name = String(row[1]).trim();

      if (isDept) {
        // Carga en Tabla Departamentos
        await this.deptRepo.upsert({ id, name }, ['id']);
      } else {
        // Carga en Tabla Municipios (Índice [3] para el ID del departamento)
        const departmentId = Number(row[3]);
        await this.muniRepo.upsert({ id, name, department_id: departmentId }, [
          'id',
        ]);
      }
    }
  }

  /**
   * Resuelve el nombre del departamento y municipio a partir de coordenadas geográficas.
   * Utiliza OpenStreetMap Nominatim con caché en memoria y resiliencia ante caídas de red.
   *
   * @param lat Latitud geográfica decimal.
   * @param lng Longitud geográfica decimal.
   * @returns Objeto con departmentName y municipalityName resueltos o null.
   * @throws No propaga errores externos; retorna campos nulos ante fallos de conectividad o límites.
   */
  async reverseGeocode(
    lat: number,
    lng: number,
  ): Promise<IReverseGeocodeResponse> {
    const cacheKey = `${lat.toFixed(3)},${lng.toFixed(3)}`;
    const cached = this.reverseCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
        lat,
      )}&lon=${encodeURIComponent(lng)}&zoom=14&addressdetails=1`;

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'FlockApp/1.0 (contacto@flockapp.co)',
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        this.logger.warn(
          `Nominatim HTTP ${response.status} al consultar [${lat}, ${lng}]`,
        );
        return { departmentName: null, municipalityName: null };
      }

      const data = (await response.json()) as NominatimResponse;
      const addr = data.address;

      if (!addr) {
        return { departmentName: null, municipalityName: null };
      }

      const departmentName = addr.state || null;
      const municipalityName =
        addr.city ||
        addr.town ||
        addr.county ||
        addr.municipality ||
        addr.village ||
        null;

      const result: IReverseGeocodeResponse = {
        departmentName,
        municipalityName,
      };

      this.reverseCache.set(cacheKey, result);
      return result;
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : JSON.stringify(error);
      this.logger.warn(`Fallo al geocodificar [${lat}, ${lng}]: ${msg}`);
      return { departmentName: null, municipalityName: null };
    }
  }
}
