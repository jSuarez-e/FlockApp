import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterPage } from './register.page';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../core/services/auth.service';
import { UiService } from '../../core/services/ui.service';
import { ModalController } from '@ionic/angular';

describe('RegisterPage', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['register']);
    const uiSpy = jasmine.createSpyObj('UiService', ['showToast', 'showLoading', 'dismissLoading']);
    const modalSpy = jasmine.createSpyObj('ModalController', ['create']);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, RegisterPage],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: UiService, useValue: uiSpy },
        { provide: ModalController, useValue: modalSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe estar definido', () => {
    expect(component).toBeTruthy();
  });

  it('debe cambiar el rol seleccionado', () => {
    component.selectedRole.set('PROVEEDOR');
    fixture.detectChanges();
    expect(component.selectedRole()).toBe('PROVEEDOR');
  });
});
