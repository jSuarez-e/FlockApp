import {
  Component,
  output,
  ChangeDetectionStrategy,
  ViewChildren,
  QueryList,
  ElementRef,
  inject,
  effect,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * @class OtpInputComponent
 * @description Componente especializado para la captura de códigos de verificación de 6 dígitos.
 * Gestiona automáticamente el foco entre celdas, la navegación con teclado y emite el código completo.
 */
@Component({
  selector: 'app-otp-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './otp-input.component.html',
  styleUrl: './otp-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtpInputComponent {
  /** @description Acceso a los elementos nativos de los inputs para gestionar el foco */
  @ViewChildren('otpBox') otpBoxes!: QueryList<ElementRef<HTMLInputElement>>;

  /** @description Emite el código de 6 dígitos cuando el usuario termina de ingresar todos los campos */
  codeCompleted = output<string>();

  /** @description Estructura interna para iterar los 6 campos */
  inputs = new Array(6);

  /** @description Formulario interno para la gestión de datos reactivos */
  otpForm: FormGroup;

  /** Signal reactiva de los valores del formulario OTP */
  private formValues;

  /** Servicio FormBuilder inyectado */
  private fb = inject(FormBuilder);

  /**
   * Inicializa el formulario reactivo y sincroniza la emisión del código completo con Signals.
   */
  constructor() {
    this.otpForm = this.fb.group({
      d1: ['', [Validators.required, Validators.pattern('[0-9]')]],
      d2: ['', [Validators.required, Validators.pattern('[0-9]')]],
      d3: ['', [Validators.required, Validators.pattern('[0-9]')]],
      d4: ['', [Validators.required, Validators.pattern('[0-9]')]],
      d5: ['', [Validators.required, Validators.pattern('[0-9]')]],
      d6: ['', [Validators.required, Validators.pattern('[0-9]')]],
    });

    this.formValues = toSignal(this.otpForm.valueChanges, {
      initialValue: this.otpForm.value,
    });

    effect(() => {
      const vals = this.formValues();
      if (vals) {
        const code = Object.values(vals).join('');
        if (code.length === 6) {
          this.codeCompleted.emit(code);
        }
      }
    });
  }

  /**
   * Salta al siguiente input automáticamente cuando se ingresa un dígito.
   * @param event - Evento de entrada de datos.
   * @param index - Índice actual del input.
   */
  handleInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.value.length > 1) {
      input.value = input.value.slice(-1);
    }

    if (input.value && index < 5) {
      this.otpBoxes.toArray()[index + 1].nativeElement.focus();
    }
  }

  /**
   * Retrocede al input anterior al presionar la tecla de borrar si el campo está vacío.
   * @param event - Evento de teclado.
   * @param index - Índice actual del input.
   */
  handleBackspace(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && !this.otpForm.get('d' + (index + 1))?.value && index > 0) {
      this.otpBoxes.toArray()[index - 1].nativeElement.focus();
    }
  }

  /**
   * Limpia todos los campos del OTP y pone el foco en el primer cuadro.
   */
  reset(): void {
    this.otpForm.reset();
    this.otpBoxes.toArray()[0].nativeElement.focus();
  }
}
