import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MainLayoutPage } from './main-layout.page';
import { Router, provideRouter } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MenuController } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AuthStore } from '../../core/stores/auth.store';
import { ProfileStore } from '../../core/stores/profile.store';
import { DashboardStore } from '../../core/stores/dashboard.store';

/**
 * Suite de pruebas para MainLayoutPage utilizando Jasmine.
 * Verifica la navegación y la integridad del cierre de sesión.
 */
describe('MainLayoutPage', () => {
  let component: MainLayoutPage;
  let fixture: ComponentFixture<MainLayoutPage>;
  let router: Router;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let menuCtrlSpy: jasmine.SpyObj<MenuController>;
  let authStoreMock: {
    /** Espía del signal de usuario */
    user: jasmine.Spy;
    /** Espía de sincronización */
    syncFromService: jasmine.Spy;
    /** Espía de cierre de sesión */
    logout: jasmine.Spy;
  };

  beforeEach(waitForAsync(() => {
    // Creamos los Spies de Jasmine para las dependencias
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);
    menuCtrlSpy = jasmine.createSpyObj('MenuController', ['close']);
    const profileStoreMock = {
      loadProfile: jasmine.createSpy('loadProfile').and.returnValue(Promise.resolve(null)),
    };
    authStoreMock = {
      user: jasmine.createSpy('user').and.returnValue(null),
      syncFromService: jasmine.createSpy('syncFromService'),
      logout: jasmine.createSpy('logout').and.returnValue(Promise.resolve()),
    };
    const dashboardStoreMock = {
      activeViewMode: jasmine.createSpy('activeViewMode').and.returnValue(null),
      setMode: jasmine.createSpy('setMode'),
    };

    TestBed.configureTestingModule({
      imports: [MainLayoutPage],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: MenuController, useValue: menuCtrlSpy },
        { provide: ProfileStore, useValue: profileStoreMock },
        { provide: AuthStore, useValue: authStoreMock },
        { provide: DashboardStore, useValue: dashboardStoreMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    fixture = TestBed.createComponent(MainLayoutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('debería crear el componente de layout principal', () => {
    expect(component).toBeTruthy();
  });

  it('debería ejecutar el flujo de logout completo', async () => {
    await component.logout();

    expect(menuCtrlSpy.close).toHaveBeenCalled();
    expect(authStoreMock.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login'], {
      replaceUrl: true,
    });
  });
});
