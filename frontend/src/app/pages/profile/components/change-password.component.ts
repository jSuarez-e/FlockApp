import { Component, inject, signal, computed } from '@angular/core';

import { FormsModule } from '@angular/forms';
import {
  ModalController,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonIcon,
} from '@ionic/angular';


// Servicios y Stores
import { ProfileStore } from './../../../core/stores/profile.store';
import { UiService } from './../../../core/services/ui.service';

// Icons
import { addIcons } from 'ionicons';
import {
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline,
  shieldCheckmarkOutline,
  closeOutline,
} from 'ionicons/icons';
import { PasswordInputComponent } from '../../../shared/components/password-input/password-input.component';
import { AuthCardHeaderComponent } from '../../../shared/components/auth-card-header/auth-card-header.component';

/**
 * @class ChangePasswordComponent
 * @description Modal inmersivo para el cambio de credenciales.
 * Incluye validación de fuerza de contraseña reactiva.
 * @author Gemini (Orquestador SDD)
 */
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    PasswordInputComponent,
    AuthCardHeaderComponent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonIcon,
  ],
})
export class ChangePasswordComponent {
  /**
   *
   */
  private readonly modalCtrl = inject(ModalController);
  /**
   *
   */
  private readonly profileStore = inject(ProfileStore);
  /**
   *
   */
  private readonly ui = inject(UiService);

  /**
   *
   */
  public oldPassword = signal<string>('');
  /**
   *
   */
  public newPassword = signal<string>('');
  /**
   *
   */
  public confirmPassword = signal<string>('');

  /**
   *
   */
  public isFormSubmitted = signal<boolean>(false);

  /**
   *
   */
  public isOldPasswordValid = computed(() => this.oldPassword().length >= 8);
  /**
   *
   */
  public isNewPasswordValid = computed(() => this.newPassword().length >= 8);
  /**
   *
   */
  public passwordsMatch = computed(() => this.newPassword() === this.confirmPassword());

  /**
   *
   */
  public isFormValid = computed(
    () => this.isOldPasswordValid() && this.isNewPasswordValid() && this.passwordsMatch(),
  );

  /**
   * Registra los iconos Ionicons necesarios para las acciones del formulario.
   */
  constructor() {
    addIcons({
      lockClosedOutline,
      eyeOutline,
      eyeOffOutline,
      shieldCheckmarkOutline,
      closeOutline,
    });
  }

  /** Cierra el modal de cambio de contraseña sin guardar cambios. */
  public dismiss(): void {
    this.modalCtrl.dismiss();
  }

  /**
   * Sincroniza el cambio de contraseña con el backend tras validación exitosa.
   */
  async onSubmit(): Promise<void> {
    this.isFormSubmitted.set(true);
    if (!this.isFormValid()) return;

    await this.ui.showLoading('Actualizando credenciales...');

    try {
      const oldPassword = this.oldPassword();
      const newPassword = this.newPassword();
      await this.profileStore.updatePassword({ oldPassword, newPassword });

      await this.ui.dismissLoading();
      this.ui.showToast('Contraseña actualizada con éxito', 'success');
      this.dismiss();
    } catch {
      await this.ui.dismissLoading();
      // El interceptor maneja los errores de contraseña incorrecta
    }
  }
}
