import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterPage } from './register.page';
import { ReactiveFormsModule } from '@angular/forms';

import { UserRole } from '../../core/models/auth.models';

describe('RegisterPage', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RegisterPage],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe estar definido', () => {
    expect(component).toBeTruthy();
  });

  it('debe requerir businessName si el rol es PROVEEDOR', () => {
    component.selectedRole.set(UserRole.PROVEEDOR);
    fixture.detectChanges();
    // removed form.get
    expect(control?.validator).not.toBeNull();
  });
});
