import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MainLayoutPage } from './main-layout.page';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MenuController } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

/**
 * Suite de pruebas para MainLayoutPage utilizando Jasmine.
 * Verifica la navegación y la integridad del cierre de sesión.
 */
describe('MainLayoutPage', () => {
  let component: MainLayoutPage;
  let fixture: ComponentFixture<MainLayoutPage>;
  let routerSpy: jasmine.SpyObj<Router>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let menuCtrlSpy: jasmine.SpyObj<MenuController>;

  beforeEach(waitForAsync(() => {
    // Creamos los Spies de Jasmine para las dependencias
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);
    menuCtrlSpy = jasmine.createSpyObj('MenuController', ['close']);

    TestBed.configureTestingModule({
      imports: [MainLayoutPage],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: MenuController, useValue: menuCtrlSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MainLayoutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('debería crear el componente de layout principal', () => {
    expect(component).toBeTruthy();
  });

  it('debería ejecutar el flujo de logout completo', async () => {
    // Configuramos el spy de logout para devolver una promesa resuelta
    authServiceSpy.logout.and.returnValue(Promise.resolve());

    await component.logout();

    expect(menuCtrlSpy.close).toHaveBeenCalled();
    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login'], {
      replaceUrl: true,
    });
  });
});
