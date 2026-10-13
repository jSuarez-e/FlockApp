/**
 * @sdd Unit tests for GeographyService verifying reverse geocode matching accuracy.
 */
import { TestBed } from '@angular/core/testing';
import { GeographyService } from './geography.service';
import { HttpClient } from '@angular/common/http';
import { DbHelperService } from './db-helper.service';
import { of } from 'rxjs';
import { Network } from '@capacitor/network';

describe('GeographyService', () => {
  let service: GeographyService;
  let httpSpy: jasmine.SpyObj<HttpClient>;
  let dbSpy: jasmine.SpyObj<DbHelperService>;

  const mockDepartments = [
    { id: 54, name: 'NORTE DE SANTANDER' },
    { id: 68, name: 'SANTANDER' },
    { id: 19, name: 'CAUCA' },
    { id: 76, name: 'VALLE DEL CAUCA' },
  ];

  const mockSantanderMunicipalities = [
    { id: 409, name: 'Guepsa' },
    { id: 410, name: 'San Gil' },
  ];

  const mockNorteMunicipalities = [
    { id: 275, name: 'Cúcuta' },
    { id: 276, name: 'Pamplona' },
  ];

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj('HttpClient', ['get']);
    dbSpy = jasmine.createSpyObj('DbHelperService', ['query']);

    TestBed.configureTestingModule({
      providers: [
        GeographyService,
        { provide: HttpClient, useValue: httpSpy },
        { provide: DbHelperService, useValue: dbSpy },
      ],
    });

    service = TestBed.inject(GeographyService);

    spyOn(Network, 'getStatus').and.returnValue(
      Promise.resolve({ connected: true, connectionType: 'wifi' }),
    );
  });

  it('debería resolver exactamente Santander (68) y no Norte de Santander (54) ante Santander/Güepsa', async () => {
    httpSpy.get.and.returnValue(
      of({ departmentName: 'Santander', municipalityName: 'Güepsa' }),
    );

    (dbSpy.query as jasmine.Spy).and.callFake((query: string, params: unknown[] = []) => {
      if (query.includes('FROM departments')) {
        return Promise.resolve(mockDepartments);
      }
      if (query.includes('FROM municipalities') && params[0] === 68) {
        return Promise.resolve(mockSantanderMunicipalities);
      }
      if (query.includes('FROM municipalities') && params[0] === 54) {
        return Promise.resolve(mockNorteMunicipalities);
      }
      return Promise.resolve([]);
    });

    const result = await service.reverseGeocode(6.0, -73.5);

    expect(result.departmentId).toBe(68);
    expect(result.municipalityId).toBe(409);
    expect(result.departmentName).toBe('Santander');
    expect(result.municipalityName).toBe('Güepsa');
  });

  it('debería resolver Norte de Santander (54) cuando la respuesta es Norte de Santander', async () => {
    httpSpy.get.and.returnValue(
      of({ departmentName: 'Norte de Santander', municipalityName: 'Cúcuta' }),
    );

    (dbSpy.query as jasmine.Spy).and.callFake((query: string, params: unknown[] = []) => {
      if (query.includes('FROM departments')) {
        return Promise.resolve(mockDepartments);
      }
      if (query.includes('FROM municipalities') && params[0] === 54) {
        return Promise.resolve(mockNorteMunicipalities);
      }
      return Promise.resolve([]);
    });

    const result = await service.reverseGeocode(7.9, -72.5);

    expect(result.departmentId).toBe(54);
    expect(result.municipalityId).toBe(275);
  });
});
