/**
 * @sdd
 * [Objetivo]: Componente compartido para selección de Departamento y Municipio en Colombia con búsqueda y filtrado interactivo en tiempo real.
 * [I/O]: Inyecta GeographyService. Models: department, municipality, departmentId, municipalityId. Inputs: layout, disabled. Output: locationChange.
 * [Edge Cases]: Carga offline desde SQLite, resolución bidireccional Nombre<->ID, deshabilitación condicional de municipios y accesibilidad a11y.
 */
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  inject,
  input,
  model,
  output,
  signal,
  computed,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonModal, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  locationOutline,
  mapOutline,
  chevronDownOutline,
  searchOutline,
  closeOutline,
  closeCircleOutline,
  checkmarkCircle,
} from 'ionicons/icons';
import {
  GeographyService,
  GeoLocation,
} from '../../../core/services/geography.service';

/**
 * Componente interactivo para selección y búsqueda de departamentos y municipios colombianos.
 */
@Component({
  selector: 'app-geo-selector',
  standalone: true,
  imports: [CommonModule, IonModal, IonIcon],
  templateUrl: './geo-selector.component.html',
  styleUrls: ['./geo-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeoSelectorComponent implements OnInit {
  /** Servicio inyectado de geografía para consulta de catálogos locales */
  private readonly geoService = inject(GeographyService);

  /** Nombre del departamento seleccionado (two-way binding) */
  department = model<string>('');

  /** Nombre del municipio seleccionado (two-way binding) */
  municipality = model<string>('');

  /** ID del departamento seleccionado (two-way binding) */
  departmentId = model<number | null>(null);

  /** ID del municipio seleccionado (two-way binding) */
  municipalityId = model<number | null>(null);

  /** Disposición visual de los campos: apilados (stacked) o en cuadrícula (grid) */
  layout = input<'stacked' | 'grid'>('stacked');

  /** Deshabilita ambos selectores */
  disabled = input<boolean>(false);

  /** Evento emitido con la resolución territorial completa */
  locationChange = output<{
    /** ID del departamento */
    departmentId: number | null;
    /** Nombre del departamento */
    departmentName: string;
    /** ID del municipio */
    municipalityId: number | null;
    /** Nombre del municipio */
    municipalityName: string;
  }>();

  /** Lista completa de departamentos cargados desde la base local */
  departments = signal<GeoLocation[]>([]);

  /** Lista de municipios pertenecientes al departamento actual */
  municipalities = signal<GeoLocation[]>([]);

  /** Estado de visibilidad del modal de búsqueda */
  isModalOpen = signal<boolean>(false);

  /** Tipo de entidad territorial activa en el modal */
  modalType = signal<'department' | 'municipality'>('department');

  /** Término de búsqueda para filtrar la lista */
  searchTerm = signal<string>('');

  /** ID numérico activo del departamento para cargar municipios */
  activeDepartmentId = computed<number | null>(() => {
    const directId = this.departmentId();
    if (directId) return directId;

    const deptName = this.department();
    if (!deptName) return null;

    const match = this.departments().find(
      (d) => d.name.toLowerCase() === deptName.toLowerCase(),
    );
    return match ? match.id : null;
  });

  /** Texto legible que se muestra en el campo de departamento */
  selectedDeptDisplay = computed<string>(() => {
    const name = this.department();
    if (name) return name;

    const id = this.departmentId();
    if (id) {
      const match = this.departments().find((d) => d.id === id);
      if (match) return match.name;
    }
    return '';
  });

  /** Texto legible que se muestra en el campo de municipio */
  selectedMuniDisplay = computed<string>(() => {
    const name = this.municipality();
    if (name) return name;

    const id = this.municipalityId();
    if (id) {
      const match = this.municipalities().find((m) => m.id === id);
      if (match) return match.name;
    }
    return '';
  });

  /** Elementos filtrados en el modal según el término de búsqueda */
  filteredItems = computed<GeoLocation[]>(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const source =
      this.modalType() === 'department'
        ? this.departments()
        : this.municipalities();

    if (!term) return source;
    return source.filter((item) => item.name.toLowerCase().includes(term));
  });

  /**
   * Registra los iconos requeridos y establece el efecto reactivo para cargar municipios.
   */
  constructor() {
    addIcons({
      locationOutline,
      mapOutline,
      chevronDownOutline,
      searchOutline,
      closeOutline,
      closeCircleOutline,
      checkmarkCircle,
    });

    // Efecto reactivo: cuando cambia el ID del departamento, recargar sus municipios
    effect(() => {
      const deptId = this.activeDepartmentId();
      if (deptId) {
        this.loadMunicipalities(deptId);
      } else {
        this.municipalities.set([]);
      }
    });
  }

  /**
   * Carga inicial del catálogo de departamentos desde SQLite local.
   */
  async ngOnInit(): Promise<void> {
    await this.loadDepartments();
  }

  /**
   * Consulta los departamentos disponibles en el sistema.
   */
  private async loadDepartments(): Promise<void> {
    try {
      const data = await this.geoService.getDepartments();
      this.departments.set(data);

      const currentDeptId = this.activeDepartmentId();
      if (currentDeptId) {
        await this.loadMunicipalities(currentDeptId);
      }
    } catch {
      this.departments.set([]);
    }
  }

  /**
   * Carga los municipios vinculados a un departamento dado.
   * @param deptId ID del departamento.
   */
  private async loadMunicipalities(deptId: number): Promise<void> {
    try {
      const data = await this.geoService.getMunicipalities(deptId);
      this.municipalities.set(data);
    } catch {
      this.municipalities.set([]);
    }
  }

  /**
   * Abre el modal de búsqueda para departamentos o municipios.
   * @param type Tipo de selector.
   */
  openPicker(type: 'department' | 'municipality'): void {
    if (this.disabled()) return;
    if (type === 'municipality' && !this.activeDepartmentId()) return;

    this.modalType.set(type);
    this.searchTerm.set('');
    this.isModalOpen.set(true);
  }

  /**
   * Cierra el modal de selección.
   */
  closePicker(): void {
    this.isModalOpen.set(false);
    this.searchTerm.set('');
  }

  /**
   * Actualiza el término de búsqueda según el input del usuario.
   * @param event Evento del input.
   */
  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    this.searchTerm.set(target ? target.value : '');
  }

  /**
   * Limpia el campo de búsqueda actual.
   */
  clearSearch(): void {
    this.searchTerm.set('');
  }

  /**
   * Selecciona una ubicación territorial y actualiza el estado correspondiente.
   * @param item Entidad seleccionada.
   */
  selectItem(item: GeoLocation): void {
    if (this.modalType() === 'department') {
      this.department.set(item.name);
      this.departmentId.set(item.id);
      this.municipality.set('');
      this.municipalityId.set(null);
      this.loadMunicipalities(item.id);

      this.locationChange.emit({
        departmentId: item.id,
        departmentName: item.name,
        municipalityId: null,
        municipalityName: '',
      });
    } else {
      this.municipality.set(item.name);
      this.municipalityId.set(item.id);

      this.locationChange.emit({
        departmentId: this.activeDepartmentId(),
        departmentName: this.selectedDeptDisplay(),
        municipalityId: item.id,
        municipalityName: item.name,
      });
    }

    this.closePicker();
  }

  /**
   * Determina si un elemento de la lista está actualmente seleccionado.
   * @param item Elemento a evaluar.
   * @returns {boolean} Verdadero si el elemento coincide con el valor seleccionado.
   */
  isItemSelected(item: GeoLocation): boolean {
    if (this.modalType() === 'department') {
      return (
        item.id === this.departmentId() ||
        item.name.toLowerCase() === this.department().toLowerCase()
      );
    }
    return (
      item.id === this.municipalityId() ||
      item.name.toLowerCase() === this.municipality().toLowerCase()
    );
  }
}
