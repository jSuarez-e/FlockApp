/**
 * @sdd
 * [Objetivo]: Modal buscador y selector de especies de aves para filtrado geográfico.
 * [I/O]: Inputs: isOpen (boolean), birds (IBirdSearch[]). Outputs: birdSelected (IBirdSearch), closeModal.
 * [Edge Cases]: Búsqueda insensible a mayúsculas/minúsculas por nombre común, científico e inglés; límite de renderizado para rendimiento fluido.
 */
import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonIcon,
  IonSearchbar,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { closeOutline, sparklesOutline } from 'ionicons/icons';
import { IBirdSearch } from '../../../../../core/models/birds.interfaces';

/**
 * Componente modal para buscar y seleccionar especies de aves.
 */
@Component({
  selector: 'app-bird-filter-modal',
  standalone: true,
  imports: [
    CommonModule,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonIcon,
    IonSearchbar,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
  ],
  templateUrl: './bird-filter-modal.component.html',
  styleUrl: './bird-filter-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BirdFilterModalComponent {
  /** Controla la visibilidad del modal */
  isOpen = input<boolean>(false);

  /** Catálogo completo de aves disponibles */
  birds = input<IBirdSearch[]>([]);

  /** Emite el ave seleccionada */
  birdSelected = output<IBirdSearch>();

  /** Emite al cerrar el modal */
  closeModal = output<void>();

  /** Término de búsqueda escrito por el usuario */
  searchTerm = signal<string>('');

  /** Lista filtrada y acotada de aves según el término de búsqueda */
  filteredBirds = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const all = this.birds() || [];
    if (!term) return all.slice(0, 50);

    return all
      .filter(
        (b) =>
          (b.common_name && b.common_name.toLowerCase().includes(term)) ||
          (b.scientific_name && b.scientific_name.toLowerCase().includes(term)) ||
          (b.english_name && b.english_name.toLowerCase().includes(term)),
      )
      .slice(0, 50);
  });

  /**
   * Registra los iconos usados en el buscador de especies.
   */
  constructor() {
    addIcons({
      closeOutline,
      sparklesOutline,
    });
  }

  /**
   * Maneja la selección de un ave y reinicia el término de búsqueda.
   * @param bird Ave elegida
   */
  onSelect(bird: IBirdSearch): void {
    this.birdSelected.emit(bird);
    this.searchTerm.set('');
  }

  /**
   * Cierra el modal y restablece el buscador.
   */
  onClose(): void {
    this.closeModal.emit();
    this.searchTerm.set('');
  }
}
