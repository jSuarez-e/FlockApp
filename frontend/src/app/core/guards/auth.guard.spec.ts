import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { authInterceptor } from './../interceptors/auth.interceptor';
import { DbHelperService } from '../services/db-helper.service';

/**
 * Pruebas unitarias para el Interceptor de Autenticación.
 * Utiliza fakeAsync para manejar la resolución de promesas de la base de datos.
 */
describe('authInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let dbHelperSpy: jasmine.SpyObj<DbHelperService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj<DbHelperService>('DbHelperService', ['getSession']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: DbHelperService, useValue: spy },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    dbHelperSpy = TestBed.inject(DbHelperService) as jasmine.SpyObj<DbHelperService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('Debe añadir el header Authorization si existe un token en la sesión', fakeAsync(() => {
    const mockSession = { token: 'token-123', user_data: '{}' };
    dbHelperSpy.getSession.and.returnValue(Promise.resolve(mockSession));

    // Ejecutamos la petición
    httpClient.get('/api/data').subscribe();

    // AVANZAMOS EL TIEMPO VIRTUAL para resolver la promesa de db.getSession()
    tick();

    const req = httpMock.expectOne('/api/data');
    expect(req.request.headers.has('Authorization')).toBeTrue();
    expect(req.request.headers.get('Authorization')).toBe('Bearer token-123');
    req.flush({});
  }));

  it('Debe continuar sin token si la sesión es nula', fakeAsync(() => {
    dbHelperSpy.getSession.and.returnValue(Promise.resolve(null));

    httpClient.get('/api/public').subscribe();

    tick(); // Resolvemos la promesa

    const req = httpMock.expectOne('/api/public');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  }));
});
