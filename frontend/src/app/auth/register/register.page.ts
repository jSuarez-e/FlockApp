import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ModalController, IonContent, IonSelect, IonSelectOption, IonButton } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { UserRole } from '../../core/models/auth.models';

// Servicios y Componentes Compartidos
import { UiService } from '../../core/services/ui.service';
import { AuthService } from '../../core/services/auth.service';
import { BrandHeaderComponent } from '../../shared/components/brand-header/brand-header.component';
import { TermsModalComponent } from '../components/terms-modal/terms-modal.component';
import { PasswordInputComponent } from './../../shared/components/password-input/password-input.component';
import { AuthInputComponent } from '../../shared/components/auth-input/auth-input.component';
import { AuthCardHeaderComponent } from './../../shared/components/auth-card-header/auth-card-header.component';

// Iconos
import { addIcons } from 'ionicons';
import {
  personOutline,
  mailOutline,
  lockClosedOutline,
  briefcaseOutline,
  documentTextOutline,
  eyeOutline,
  eyeOffOutline,
  arrowBackOutline,
} from 'ionicons/icons';

/**
 * @class RegisterPage
 * Maneja el registro de usuarios con validaciones dinámicas para proveedores.
 * Usa el patrón Signal-per-field para compatibilidad con AuthInputComponent.
 */
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    IonContent,
    IonSelect,
    IonSelectOption,
    IonButton,
    BrandHeaderComponent,
    AuthInputComponent,
    PasswordInputComponent,
    AuthCardHeaderComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPage {
  private readonly ui = inject(UiService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly modalCtrl = inject(ModalController);

  // ── Signal-per-field (contrato del template) ──────────────────────────────
  readonly selectedRole = signal<string>('PAJARERO');
  readonly showPassword = signal<boolean>(false);

  // Campos del formulario como signals (two-way con AuthInputComponent/PasswordInputComponent)
  readonly firstName = signal<string>('');
  readonly lastName = signal<string>('');
  readonly username = signal<string>('');
  readonly email = signal<string>('');
  readonly password = signal<string>('');
  readonly businessName = signal<string>('');
  readonly rnt = signal<string>('');

  /** Indica si el usuario intentó enviar el formulario (activa validación visual) */
  readonly isFormSubmitted = signal<boolean>(false);

  // ── Validadores computados ────────────────────────────────────────────────
  readonly isFirstNameValid = computed(() => this.firstName().trim().length > 0);
  readonly isLastNameValid = computed(() => this.lastName().trim().length > 0);
  readonly isUsernameValid = computed(() => this.username().trim().length >= 4);
  readonly isEmailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email()));
  readonly isPasswordValid = computed(() => this.password().length >= 8);
  readonly isBusinessNameValid = computed(
    () =>
      (this.selectedRole() !== 'PROVEEDOR' && this.selectedRole() !== 'BOTH') ||
      this.businessName().trim().length > 0,
  );
  readonly isRntValid = computed(
    () =>
      (this.selectedRole() !== 'PROVEEDOR' && this.selectedRole() !== 'BOTH') ||
      this.rnt().trim().length > 0,
  );
  readonly isFormValid = computed(
    () =>
      this.isFirstNameValid() &&
      this.isLastNameValid() &&
      this.isUsernameValid() &&
      this.isEmailValid() &&
      this.isPasswordValid() &&
      this.isBusinessNameValid() &&
      this.isRntValid(),
  );

  constructor() {
    addIcons({
      personOutline,
      mailOutline,
      lockClosedOutline,
      briefcaseOutline,
      documentTextOutline,
      eyeOutline,
      eyeOffOutline,
      arrowBackOutline,
    });
  }

  /**
   * @method onRoleChange
   * Gestiona la obligatoriedad de campos de negocio si el rol es PROVEEDOR o BOTH.
   * @param {CustomEvent} event - Evento de cambio del ion-select.
   */
  onRoleChange(event: CustomEvent): void {
    const role = event.detail.value as string;
    this.selectedRole.set(role);
    // Si el rol cambia a no-proveedor, limpiamos los campos opcionales
    if (role !== 'PROVEEDOR' && role !== 'BOTH') {
      this.businessName.set('');
      this.rnt.set('');
    }
  }

  /** @method togglePassword — Alterna la visibilidad de la contraseña. */
  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  /**
   * @method openTerms
   * Presenta la modal de Términos y Condiciones.
   */
  async openTerms(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: TermsModalComponent,
    });
    await modal.present();
  }

  /**
   * @method onRegister
   * Ejecuta el proceso de registro validando el estado del formulario Signal.
   */
  async onRegister(): Promise<void> {
    this.isFormSubmitted.set(true);

    if (!this.isFormValid()) {
      await this.ui.showToast('Completa los campos obligatorios', 'warning');
      return;
    }

    await this.ui.showLoading('Creando cuenta en FlockApp...');

    try {
      const payload = {
        role: this.selectedRole() as UserRole,
        firstName: this.firstName(),
        lastName: this.lastName(),
        username: this.username(),
        email: this.email(),
        password: this.password(),
        businessName: this.businessName() || undefined,
        rnt: this.rnt() || undefined,
      };
      await this.authService.register(payload);
      await this.ui.dismissLoading();
      await this.ui.showToast('¡Cuenta creada con éxito!', 'success');
      this.router.navigate(['/home'], { replaceUrl: true });
    } catch (err: unknown) {
      await this.ui.dismissLoading();
      const msg =
        (err as { error?: { message?: string } }).error?.message || 'Error al crear la cuenta.';
      await this.ui.showToast(msg, 'danger');
    }
  }
}
