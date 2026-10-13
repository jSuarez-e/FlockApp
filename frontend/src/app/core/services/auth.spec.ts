import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { DbHelperService } from './db-helper.service';
import { CryptoService } from './crypto.service';
import { AuthResponse, User, UserRole } from '../models/auth.models';
import { environment } from '../../../environments/environment';

/**
 * Suite de pruebas para AuthService.
 * Verifica el flujo de autenticación, persistencia y manejo de señales.
 */
describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let dbHelperSpy: jasmine.SpyObj<DbHelperService>;
  let cryptoSpy: jasmine.SpyObj<CryptoService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj<DbHelperService>('DbHelperService', [
      'saveSession',
      'clearSession',
    ]);
    cryptoSpy = jasmine.createSpyObj<CryptoService>('CryptoService', ['encryptRSA']);
    cryptoSpy.encryptRSA.and.resolveTo('encrypted-pass');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: DbHelperService, useValue: spy },
        { provide: CryptoService, useValue: cryptoSpy },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    dbHelperSpy = TestBed.inject(DbHelperService) as jasmine.SpyObj<DbHelperService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('Debe inicializarse con el usuario en null', () => {
    expect(service.currentUser()).toBeNull();
  });

  /**
   * Prueba: Login con persistencia.
   * IMPORTANTE: Se pasa 'true' como tercer parámetro para activar saveSession.
   */
  it('Debe ejecutar login, guardar sesión y actualizar el signal del usuario', async () => {
    const mockUser: User = {
      id: 1,
      email: 'user@test.com',
      firstName: 'Test',
      lastName: 'L',
      username: 'testuser',
      role: UserRole.PAJARERO,
    };
    const mockRes: AuthResponse = {
      access_token: 'token-abc-123',
      user: mockUser,
    };

    // PASO CLAVE: El tercer argumento 'true' activa la lógica de guardado en el servicio
    const loginPromise = service.login('user@test.com', '123', true);
    await Promise.resolve();

    // Ajustamos la URL para que coincida con: API_URL + '/login'
    const req = httpMock.expectOne(`${environment.authUrl}/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockRes);

    const res = await loginPromise;

    // Validaciones
    expect(res.access_token).toBe('token-abc-123');
    expect(service.currentUser()).toEqual(mockUser);

    // Ahora el espía sí debe haber sido llamado
    expect(dbHelperSpy.saveSession).toHaveBeenCalledWith('token-abc-123', mockUser);
  });

  it('Debe realizar login pero NO guardar sesión si remember es false', async () => {
    const mockRes: AuthResponse = {
      access_token: 'token-no-save',
      user: {
        id: 2,
        email: 'no-remember@test.com',
        firstName: 'A',
        lastName: 'B',
        username: 'u',
        role: UserRole.PAJARERO,
      },
    };

    // Si pasamos false (o nada), no debe llamar a DbHelper
    const loginPromise = service.login('no-remember@test.com', '123', false);
    await Promise.resolve();

    const req = httpMock.expectOne(`${environment.authUrl}/login`);
    req.flush(mockRes);

    await loginPromise;

    expect(dbHelperSpy.saveSession).not.toHaveBeenCalled();
  });
});
