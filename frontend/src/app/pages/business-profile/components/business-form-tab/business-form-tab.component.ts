/**
 * @sdd
 * [Objetivo]: Pestaña de formulario y datos del perfil comercial del guía.
 * [I/O]: Inyecta BusinessProfileStore; emite save al guardar.
 * [Edge Cases]: Validación reactiva de campos limpios (isPristine), cambio dinámico de departamentos y municipios.
 */
import {
  Component,
  ChangeDetectionStrategy,
  inject,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonIcon,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonToggle,
  IonLabel,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  businessOutline,
  callOutline,
  logoWhatsapp,
  mailOutline,
  logoInstagram,
  globeOutline,
  chatbubbleEllipsesOutline,
  documentTextOutline,
  starOutline,
  listOutline,
  eyeOutline,
} from 'ionicons/icons';
import { AuthInputComponent } from '../../../../shared/components/auth-input/auth-input.component';
import { BusinessProfileStore } from '../../business-profile.store';

/**
 * Detalle del evento de selección en ion-select.
 */
interface SelectChangeDetail {
  /** Valor seleccionado */
  value: string;
}

/**
 * Componente presentador para la pestaña de datos del perfil comercial.
 */
@Component({
  selector: 'app-business-form-tab',
  templateUrl: './business-form-tab.component.html',
  styleUrls: ['./business-form-tab.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonIcon,
    IonButton,
    IonSelect,
    IonSelectOption,
    IonToggle,
    IonLabel,
    AuthInputComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BusinessFormTabComponent {
  /** Inyección del store de perfil de negocio */
  public readonly store = inject(BusinessProfileStore);

  /** Indica si el formulario no tiene cambios pendientes */
  public readonly isPristine = input<boolean>(true);

  /** Evento emitido para guardar el perfil */
  public readonly save = output<void>();

  /**
   * Registra los iconos usados en el formulario de negocio.
   */
  constructor() {
    addIcons({
      businessOutline,
      callOutline,
      logoWhatsapp,
      mailOutline,
      logoInstagram,
      globeOutline,
      chatbubbleEllipsesOutline,
      documentTextOutline,
      starOutline,
      listOutline,
      eyeOutline,
    });
  }

  /**
   * Manejador de cambio de departamento para cargar municipios dinámicos.
   * @param event Evento CustomEvent de IonSelect.
   */
  public onDepartmentChange(event: CustomEvent<SelectChangeDetail>): void {
    this.store.updateField('department', event.detail.value);
    this.store.updateField('municipality', '');
    this.store.loadMunicipalities(event.detail.value);
  }

  /**
   * Envía la solicitud de guardado de perfil.
   */
  public onSubmit(): void {
    this.save.emit();
  }
}
