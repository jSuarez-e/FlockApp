import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { IonContent, IonButton } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';

import { UiService } from '../../core/services/ui.service';
import { AuthService } from '../../core/services/auth.service';
import { AuthError } from '../../core/models/auth.models';
import { BrandHeaderComponent } from '../../shared/components/brand-header/brand-header.component';
import { OtpInputComponent } from '../../shared/components/otp-input/otp-input.component';

import { addIcons } from 'ionicons';
import {
  mailOutline,
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline,
  shieldCheckmarkOutline,
} from 'ionicons/icons';
import { AuthInputComponent } from '../../shared/components/auth-input/auth-input.component';
import { PasswordInputComponent } from '../../shared/components/password-input/password-input.component';
import { AuthCardHeaderComponent } from '../../shared/components/auth-card-header/auth-card-header.component';

/** @description Definición de los pasos posibles en el wizard de recuperación. */
type RecoveryStep = 'email' | 'otp' | 'reset';

/**
 * Orquesta el proceso de recuperación de cuenta en tres fases:
 * Solicitud de código, Verificación OTP y Restablecimiento de credenciales.
 */
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    BrandHeaderComponent,
    OtpInputComponent,
    AuthInputComponent,
    PasswordInputComponent,
    AuthCardHeaderComponent,
    IonContent,
    IonButton,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordPage {
  /** UI Service */
  private readonly ui = inject(UiService);
  /** Auth Service */
  private readonly authService = inject(AuthService);
  /** Router */
  private readonly router = inject(Router);

  /** Signal que controla la visibilidad de los bloques @switch en el template. */
  currentStep = signal<RecoveryStep>('email');

  /** Email capturado para persistencia durante las fases 2 y 3. */
  userEmail = signal<string>('');

  /** Código OTP emitido por el componente app-otp-input. */
  otpValue = signal<string>('');

  /** Token firmado necesario para autorizar el cambio de clave en el backend. */
  recoveryToken = signal<string>('');

  /** Controla visibilidad */
  showPassword = signal<boolean>(false);
  /** Bandera de envío */
  isFormSubmitted = signal<boolean>(false);

  // Formularios para cada fase convertidos a Signals
  /** Es email válido */
  isEmailValid = computed(() => {
    const val = this.userEmail();
    return val ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) : false;
  });

  /** Clave */
  password = signal<string>('');
  /** Confirmación de clave */
  confirmPassword = signal<string>('');

  /** Es clave válida */
  isPasswordValid = computed(() => this.password().length >= 8);
  /** Claves coinciden */
  passwordsMatch = computed(() => this.password() === this.confirmPassword());
  /** Formulario es válido */
  isResetFormValid = computed(() => this.isPasswordValid() && this.passwordsMatch());

  /**
   * Registra la iconografía requerida para los campos de entrada.
   */
  constructor() {
    addIcons({
      mailOutline,
      lockClosedOutline,
      eyeOutline,
      eyeOffOutline,
      shieldCheckmarkOutline,
    });
  }

  // Validación eliminada, se hace con computados

  /**
   * Fase 1: Envía el correo al backend para disparar el envío del OTP.
   * @returns Promesa vacía
   */
  async onRequestCode(): Promise<void> {
    this.isFormSubmitted.set(true);
    if (!this.isEmailValid()) {
      this.ui.showToast('Ingresa un correo válido', 'warning');
      return;
    }

    const email = this.userEmail();
    await this.ui.showLoading('Verificando cuenta...');

    try {
      await this.authService.forgotPassword(email);
      this.currentStep.set('otp');
      await this.ui.dismissLoading();
      this.isFormSubmitted.set(false);
      this.ui.showToast('Código enviado a tu correo', 'success');
    } catch (err: unknown) {
      await this.ui.dismissLoading();
      const error = err as AuthError;
      const msg = Array.isArray(error.error?.message)
        ? error.error.message[0]
        : error.error?.message || 'Error al procesar la solicitud.';
      this.ui.showToast(msg, 'danger');
    }
  }

  /**
   * Solicita un nuevo código OTP al backend sin cambiar de fase.
   * @returns Promesa vacía
   */
  async onResendCode(): Promise<void> {
    await this.ui.showLoading('Reenviando...');
    try {
      await this.authService.forgotPassword(this.userEmail());
      await this.ui.dismissLoading();
      this.ui.showToast('Nuevo código enviado', 'success');
    } catch {
      await this.ui.dismissLoading();
      this.ui.showToast('Error al reenviar el código', 'danger');
    }
  }

  /**
   * Maneja la emisión del código completo desde el componente hijo.
   * @param code El código de 6 dígitos concatenado.
   */
  onOtpCodeCompleted(code: string): void {
    this.otpValue.set(code);
  }

  /**
   * Fase 2: Envía el código al backend para validación y obtención del recoveryToken.
   * @returns Promesa vacía
   */
  async onVerifyOtp(): Promise<void> {
    if (this.otpValue().length < 6) return;

    await this.ui.showLoading('Validando código...');
    try {
      const response = await this.authService.verifyOtp(this.userEmail(), this.otpValue());
      this.recoveryToken.set(response.recoveryToken);
      this.currentStep.set('reset');
      await this.ui.dismissLoading();
    } catch (err: unknown) {
      await this.ui.dismissLoading();
      const error = err as AuthError;
      const msg = Array.isArray(error.error?.message)
        ? error.error.message[0]
        : error.error?.message || 'Código incorrecto o expirado.';
      this.ui.showToast(msg, 'danger');
    }
  }

  /**
   * Fase 3: Realiza el cambio físico de contraseña en la base de datos.
   * @returns Promesa vacía
   */
  async onResetPassword(): Promise<void> {
    this.isFormSubmitted.set(true);
    if (!this.isResetFormValid()) {
      if (!this.passwordsMatch()) {
        this.ui.showToast('Las contraseñas no coinciden', 'warning');
      } else {
        this.ui.showToast('La contraseña debe tener al menos 8 caracteres', 'warning');
      }
      return;
    }

    await this.ui.showLoading('Actualizando contraseña...');
    try {
      const newPass = this.password();
      await this.authService.resetPassword(this.userEmail(), newPass, this.recoveryToken());

      await this.ui.dismissLoading();
      await this.ui.showToast('¡Contraseña actualizada!', 'success');
      this.router.navigate(['/auth/login'], { replaceUrl: true });
    } catch (err: unknown) {
      await this.ui.dismissLoading();
      const error = err as AuthError;
      const msg = Array.isArray(error.error?.message)
        ? error.error.message[0]
        : error.error?.message || 'Error al actualizar.';
      this.ui.showToast(msg, 'danger');
    }
  }

  /**
   * Alterna el estado del signal showPassword para visualizar caracteres.
   */
  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }
}
