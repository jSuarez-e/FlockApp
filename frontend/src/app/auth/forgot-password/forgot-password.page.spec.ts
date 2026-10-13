import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotPasswordPage } from './forgot-password.page';
import { provideRouter } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ForgotPasswordPage', () => {
  let component: ForgotPasswordPage;
  let fixture: ComponentFixture<ForgotPasswordPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ForgotPasswordPage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('el formulario debe ser inválido con email vacío', () => {
    component.userEmail.set('');
    expect(component.isEmailValid()).toBeFalse();
  });

  it('el formulario debe ser válido con email correcto', () => {
    component.userEmail.set('test@flockapp.co');
    expect(component.isEmailValid()).toBeTrue();
  });
});
