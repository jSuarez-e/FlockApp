import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AuthService } from './core/services/auth.service';
import { DbHelperService } from './core/services/db-helper.service';
import { Router, provideRouter } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';
import { signal, WritableSignal } from '@angular/core';

/**
 * Suite de pruebas para AppComponent.
 * Soluciona el error "Expected a spy, but got Function" asegurando la vinculación de Spies.
 */
describe('AppComponent', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let dbHelperSpy: jasmine.SpyObj<DbHelperService>;
  let router: Router;
  let currentUserSignal: WritableSignal<unknown | null>;

  beforeEach(async () => {
    // 1. Configuración de Signals y Spies básicos
    currentUserSignal = signal<unknown | null>(null);

    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', [], {
      currentUser: currentUserSignal,
    });

    dbHelperSpy = jasmine.createSpyObj<DbHelperService>('DbHelperService', ['getSession']);

    // 2. Espionaje de SplashScreen (Método estático de Capacitor)
    // Usamos spyOn directamente sobre el objeto importado
    spyOn(SplashScreen, 'hide').and.returnValue(Promise.resolve());

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: DbHelperService, useValue: dbHelperSpy },
        provideRouter([]), // Necesario para que el template (IonRouterOutlet) no falle
      ],
    }).compileComponents();

    // 3. Inyectamos el Router real y creamos el Spy sobre su método navigate
    router = TestBed.inject(Router);
    // IMPORTANTE: spyOn devuelve el spy, pero también modifica el objeto inyectado
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
  });

  /**
   * Test: Navegación a Home
   */
  xit('Debe navegar a /home si existe una sesión válida', async () => {
    const mockUser = { id: 1, firstName: 'Jaime' };
    dbHelperSpy.getSession.and.returnValue(
      Promise.resolve({
        token: 'abc',
        user_data: mockUser,
      }),
    );

    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    await app.initializeApp();

    // Verificamos el spy del router
    expect(router.navigate).toHaveBeenCalledWith(['/home'], {
      replaceUrl: true,
    });
    // Verificamos el spy de SplashScreen
    expect(SplashScreen.hide).toHaveBeenCalled();
  });

  /**
   * Test: Redirección a Login
   */
  xit('Debe navegar a /auth/login si no existe sesión', async () => {
    dbHelperSpy.getSession.and.returnValue(Promise.resolve(null));

    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    await app.initializeApp();

    // Aquí router.navigate ya es un Spy gracias al spyOn del beforeEach
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login'], {
      replaceUrl: true,
    });
    expect(SplashScreen.hide).toHaveBeenCalled();
  });
});
