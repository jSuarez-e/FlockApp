import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { authInterceptor } from './auth.interceptor';
import { DbHelperService } from '../services/db-helper.service';

/**
 * Suite de pruebas para el interceptor funcional de autenticación.
 * Maneja la asincronía del DbHelperService usando fakeAsync.
 */
describe('authInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let dbHelperSpy: jasmine.SpyObj<DbHelperService>;

  beforeEach(() => {
    // Definimos el spy para el servicio de base de datos
    dbHelperSpy = jasmine.createSpyObj<DbHelperService>('DbHelperService', ['getSession']);

    TestBed.configureTestingModule({
      providers: [
        // Configuramos el cliente HTTP con nuestro interceptor funcional
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: DbHelperService, useValue: dbHelperSpy },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    // Verificamos que no queden peticiones colgadas
    httpMock.verify();
  });

  /**
   * Prueba: Inyección exitosa del token.
   */
  it('Debe añadir el header Authorization si existe un token en la sesión', fakeAsync(() => {
    // 1. Preparamos el mock de la sesión
    const mockSession = { token: 'jwt-123-token', user_data: '{}' };
    dbHelperSpy.getSession.and.returnValue(Promise.resolve(mockSession));

    // 2. Realizamos la petición
    httpClient.get('/api/data').subscribe();

    /** * 3. CRÍTICO: Avanzamos el tiempo virtual.
     * Esto resuelve la promesa de db.getSession() dentro del interceptor.
     */
    tick();

    // 4. Validamos la petición
    const req = httpMock.expectOne('/api/data');
    expect(req.request.headers.has('Authorization')).toBeTrue();
    expect(req.request.headers.get('Authorization')).toBe('Bearer jwt-123-token');

    req.flush({}); // Cerramos la petición
  }));

  /**
   * Prueba: Continuidad sin token.
   */
  it('Debe continuar con la petición original si no hay sesión activa', fakeAsync(() => {
    // 1. Simulamos que no hay sesión
    dbHelperSpy.getSession.and.returnValue(Promise.resolve(null));

    // 2. Realizamos la petición
    httpClient.get('/api/public').subscribe();

    // 3. Resolvemos la promesa asíncrona
    tick();

    // 4. Validamos que NO tenga el header
    const req = httpMock.expectOne('/api/public');
    expect(req.request.headers.has('Authorization')).toBeFalse();

    req.flush({});
  }));
});
