import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { provideRouter } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('LoginPage (Validación Dual)', () => {
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(LoginPage);
    fixture.detectChanges();
  });

  it('debe aceptar un correo válido', () => {
    fixture.componentInstance.identifier.set('test@flockapp.co');
    expect(fixture.componentInstance.isIdentifierValid()).toBeTrue();
  });

  it('debe aceptar un username válido (min 3)', () => {
    fixture.componentInstance.identifier.set('avi');
    expect(fixture.componentInstance.isIdentifierValid()).toBeTrue();
  });

  it('debe invalidar un username muy corto', () => {
    fixture.componentInstance.identifier.set('ab');
    expect(fixture.componentInstance.isIdentifierValid()).toBeFalse();
  });
});
