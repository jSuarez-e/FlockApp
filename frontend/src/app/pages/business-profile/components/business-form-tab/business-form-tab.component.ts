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
  computed,
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
 * Detalle del evento de selección múltiple en ion-select.
 */
interface MultiSelectChangeDetail {
  /** Lista de valores seleccionados */
  value: string[];
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

  /** Indica si todos los campos obligatorios del formulario son válidos */
  public readonly isFormValid = input<boolean>(false);

  /** Evento emitido para guardar el perfil */
  public readonly save = output<void>();

  /** Idiomas predefinidos disponibles para selección múltiple */
  public readonly availableLanguages: string[] = [
    'Español',
    'Inglés',
    'Francés',
    'Alemán',
    'Portugués',
    'Italiano',
  ];

  /** Especialidades profesionales de aviturismo */
  public readonly availableSpecialties: string[] = [
    'Hides',
    'Rutas',
    'Fotografía',
    'Endémicas',
    'Senderismo',
    'Tour Privado',
    'Aviturismo General',
  ];

  /** Lista de idiomas seleccionados a partir del string del store */
  public readonly selectedLanguages = computed<string[]>(() => {
    const raw = this.store.languages();
    if (!raw) return [];
    return raw.split(',').map((s) => s.trim()).filter(Boolean);
  });

  /** Lista de especialidades seleccionadas a partir del string del store */
  public readonly selectedSpecialties = computed<string[]>(() => {
    const raw = this.store.specialties();
    if (!raw) return [];
    return raw.split(',').map((s) => s.trim()).filter(Boolean);
  });

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
   * Manejador de selección múltiple de idiomas.
   * @param event Evento CustomEvent emitido por IonSelect.
   */
  public onLanguagesChange(event: CustomEvent<MultiSelectChangeDetail>): void {
    const val = event.detail.value || [];
    this.store.updateField('languages', val.join(', '));
  }

  /**
   * Manejador de selección múltiple de especialidades.
   * @param event Evento CustomEvent emitido por IonSelect.
   */
  public onSpecialtiesChange(event: CustomEvent<MultiSelectChangeDetail>): void {
    const val = event.detail.value || [];
    this.store.updateField('specialties', val.join(', '));
  }

  /**
   * Envía la solicitud de guardado de perfil.
   */
  public onSubmit(): void {
    this.save.emit();
  }
}
