import {
  Component,
  output,
  ChangeDetectionStrategy,
  ViewChildren,
  QueryList,
  ElementRef,
  DestroyRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="otpForm" class="otp-container">
      @for (input of inputs; track $index) {
      <input
        #otpBox
        type="number"
        [formControlName]="'d' + ($index + 1)"
        class="otp-box"
        maxlength="1"
        (input)="handleInput($event, $index)"
        (keydown)="handleBackspace($event, $index)"
        inputmode="numeric"
        autocomplete="one-time-code"
      />
      }
    </form>
  `,
  styles: [
    `
      .otp-container {
        display: flex;
        justify-content: space-between;
        gap: 8px;
        margin: 10px 0 20px 0;
      }
      .otp-box {
        width: 100%;
        aspect-ratio: 1;
        max-width: 50px;
        height: 55px;
        border: 2px solid var(--avitour-border);
        border-radius: 12px;
        background: var(--avitour-background);
        text-align: center;
        font-size: 1.5rem;
        font-weight: 800;
        color: var(--avitour-primary);
        transition: all 0.2s ease;
        outline: none;
      }
      .otp-box:focus {
        border-color: var(--avitour-primary);
        box-shadow: 0 0 0 4px rgba(16, 131, 70, 0.1);
        background: #ffffff;
      }
      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
    `,
  ],
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

  /**
   *
   */
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  /**
   *
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

    // Escuchar cambios para emitir el valor cuando esté lleno
    this.otpForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((vals) => {
      const code = Object.values(vals).join('');
      if (code.length === 6) this.codeCompleted.emit(code);
    });
  }

  /**
   * @method handleInput
   * @description Salta al siguiente input automáticamente cuando se ingresa un dígito.
   * @param {Event} event - Evento de entrada de datos.
   * @param {number} index - Índice actual del input.
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
   * @method handleBackspace
   * @description Retrocede al input anterior al presionar la tecla de borrar si el campo está vacío.
   * @param {KeyboardEvent} event - Evento de teclado.
   * @param {number} index - Índice actual del input.
   */
  handleBackspace(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && !this.otpForm.get('d' + (index + 1))?.value && index > 0) {
      this.otpBoxes.toArray()[index - 1].nativeElement.focus();
    }
  }

  /**
   * @method reset
   * @description Limpia todos los campos del OTP y pone el foco en el primer cuadro.
   */
  reset(): void {
    this.otpForm.reset();
    this.otpBoxes.toArray()[0].nativeElement.focus();
  }
}
