import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthInputComponent } from './auth-input.component';
import { FormsModule } from '@angular/forms';
import { ComponentRef } from '@angular/core';

describe('AuthInputComponent', () => {
  let component: AuthInputComponent;
  let fixture: ComponentFixture<AuthInputComponent>;
  let componentRef: ComponentRef<AuthInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthInputComponent, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthInputComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the label if provided', () => {
    componentRef.setInput('label', 'Test Label');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.auth-input__label')?.textContent).toContain('Test Label');
  });

  it('should apply invalid class when touched and invalid', () => {
    component.isTouched.set(true);
    componentRef.setInput('isInvalid', true);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.auth-input__wrapper--invalid')).toBeTruthy();
  });

  it('should apply readonly class when readonly input is true', () => {
    componentRef.setInput('readonly', true);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.auth-input__wrapper--readonly')).toBeTruthy();
  });
});
