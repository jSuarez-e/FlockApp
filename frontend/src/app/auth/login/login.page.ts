import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { ViewWillEnter, ViewDidEnter } from '@ionic/angular';

import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonCheckbox } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';

import { AuthStore } from '../../core/stores/auth.store';
import { UiService } from '../../core/services/ui.service';
import { AuthResponse, AuthError } from '../../core/models/auth.models';

// Iconos
import { addIcons } from 'ionicons';
import {
  personOutline,
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline,
  leafOutline,
} from 'ionicons/icons';
import { BrandHeaderComponent } from '../../shared/components/brand-header/brand-header.component';
import { PasswordInputComponent } from '../../shared/components/password-input/password-input.component';
import { AuthInputComponent } from '../../shared/components/auth-input/auth-input.component';
import { AuthCardHeaderComponent } from '../../shared/components/auth-card-header/auth-card-header.component';

/**
 * Gestiona el acceso de usuarios mediante identificador dual (email/usuario).
 * Implementa una interfaz minimalista con validación reactiva en tiempo real.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    BrandHeaderComponent,
    AuthInputComponent,
    PasswordInputComponent,
    AuthCardHeaderComponent,
    IonContent,
    IonButton,
    IonCheckbox,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage implements ViewWillEnter, ViewDidEnter {
  /** Auth Store */
  private readonly authStore = inject(AuthStore);
  /** UI Service */
  private readonly ui = inject(UiService);
  /** Router */
  private readonly router = inject(Router);

  /** Visibility toggle */
  showPassword = signal<boolean>(false);

  // Signals para el estado del formulario
  /** Identifier input */
  identifier = signal<string>('');
  /** Password input */
  password = signal<string>('');
  /** Remember me checkbox */
  rememberMe = signal<boolean>(false);

  // Computados para validaciones
  /** Validates identifier format */
  isIdentifierValid = computed(() => {
    const val = this.identifier();
    if (!val) return false;
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    if (val.includes('@')) return isEmail;
    return val.length >= 3;
  });

  /** Validates password length */
  isPasswordValid = computed(() => this.password().length >= 8);

  /** Validates overall form */
  isFormValid = computed(() => this.isIdentifierValid() && this.isPasswordValid());
  /** Tracks submission status */
  isFormSubmitted = signal<boolean>(false);

  /** Initializer */
  constructor() {
    addIcons({
      personOutline,
      lockClosedOutline,
      eyeOutline,
      eyeOffOutline,
      leafOutline,
    });
  }

  /**
   * Purgamos agresivamente los datos cacheados por Ionic al entrar a la vista
   */
  ionViewWillEnter() {
    this.identifier.set('');
    this.password.set('');
    this.isFormSubmitted.set(false);
  }

  /**
   * Hook de Ionic para view did enter
   */
  ionViewDidEnter() {
    setTimeout(() => {
      if (!this.identifier() && !this.password()) {
        this.identifier.set('');
        this.password.set('');
      }
    }, 150);
  }

  /**
   * Autentica al usuario.
   * @returns Promesa
   */
  async onLogin(): Promise<void> {
    this.isFormSubmitted.set(true);
    if (!this.isFormValid()) {
      return;
    }

    await this.ui.showLoading('Iniciando sesión...');

    try {
      const res: AuthResponse = await this.authStore.login(
        this.identifier(),
        this.password(),
        this.rememberMe(),
      );
      await this.ui.dismissLoading();
      await this.ui.showToast(`Bienvenido, ${res.user.firstName}`, 'success');
      this.router.navigate(['/home'], { replaceUrl: true });
    } catch (err: unknown) {
      await this.ui.dismissLoading();
      const error = err as AuthError;
      const msg = Array.isArray(error.error?.message)
        ? error.error.message[0]
        : error.error?.message || (err instanceof Error ? err.message : 'Error de acceso');
      await this.ui.showToast(msg, 'danger');
    }
  }

  /**
   * Alterna el estado del signal showPassword.
   */
  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }
}
