import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasswordInputComponent } from './password-input.component';
import { FormsModule } from '@angular/forms';
import { PasswordMeterComponent } from '../password-meter/password-meter.component';
import { ComponentRef } from '@angular/core';

describe('PasswordInputComponent', () => {
  let component: PasswordInputComponent;
  let fixture: ComponentFixture<PasswordInputComponent>;
  let componentRef: ComponentRef<PasswordInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordInputComponent, FormsModule, PasswordMeterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordInputComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword()).toBeFalse();
    component.toggleVisibility();
    expect(component.showPassword()).toBeTrue();
  });

  it('should apply invalid class when touched and invalid', () => {
    component.isTouched.set(true);
    componentRef.setInput('isInvalid', true);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.auth-input__wrapper--invalid')).toBeTruthy();
  });
});
