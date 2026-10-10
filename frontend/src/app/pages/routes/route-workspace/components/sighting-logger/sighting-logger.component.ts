/**
 * @file sighting-logger.component.ts
 * @sdd Dumb component que representa el panel inferior para registro veloz.
 */
import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
  inject,
  ViewChild,
  ElementRef,
  computed,
} from '@angular/core';
import { IBirdSearch } from '../../../../../core/models/birds.interfaces';
import { IRouteSighting } from '../../../../../../../../shared/models/routes.interface';

import {
  IonList,
  IonItem,
  IonLabel,
  IonAvatar,
  IonIcon,
  AlertController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  searchOutline,
  chevronDownOutline,
  closeCircleOutline,
} from 'ionicons/icons';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../../../environments/environment';

/**
 *
 */
@Component({
  selector: 'app-sighting-logger',
  standalone: true,
  imports: [
    IonList,
    IonItem,
    IonLabel,
    IonAvatar,
    IonIcon,
    FormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sighting-logger.component.html',
  styleUrls: ['./sighting-logger.component.scss'],
})
export class SightingLoggerComponent {
  /**
   *
   */
  alertCtrl = inject(AlertController);

  /**
   * Referencia al input nativo de búsqueda de aves.
   */
  @ViewChild('searchInput') searchInputElement?: ElementRef<HTMLInputElement>;

  /**
   * Constructor que registra los iconos necesarios para el flock-input-field.
   */
  constructor() {
    addIcons({
      'search-outline': searchOutline,
      'chevron-down-outline': chevronDownOutline,
      'close-circle-outline': closeCircleOutline,
    });
  }

  /**
   *
   */
  searchResults = input<IBirdSearch[]>([]);
  /**
   *
   */
  sightingsLog = input<
    (IRouteSighting & {
      /**
       *
       */
      birdInfo?: Partial<IBirdSearch>;
    })[]
  >([]);

  /** Evento emitido al buscar texto */
  searchQuery = output<string>();
  /** Evento emitido al agregar avistamiento */
  sightingAdded = output<{
    /**
     *
     */
    birdId: string;
    /**
     *
     */
    quantity: number;
    /**
     *
     */
    details: string;
    /**
     *
     */
    birdInfo?: Partial<IBirdSearch>;
  }>();


  /**
   *
   */
  uniqueSpeciesCount = computed(() => this.sightingsLog().length);
  /**
   *
   */
  totalBirdsCount = computed(() => {
    return this.sightingsLog().reduce(
      (acc: number, sighting: IRouteSighting) => acc + ((sighting.quantity as number) || 1),
      0,
    );
  });

  /**
   * Resuelve la URL o ruta de la imagen del ave.
   * Si no existe o es '-', se retorna la imagen por defecto: assets/imgs/commons/no-image.png.
   * @param image Ruta o URL de la imagen del ave.
   * @returns URL o ruta resuelta para el elemento img.
   */
  getBirdImageUrl(image?: string | null): string {
    if (!image || image === '-' || image.trim() === '') {
      return 'assets/imgs/commons/no-image.png';
    }
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }
    if (image.startsWith('/uploads/') || image.startsWith('uploads/')) {
      const cleanPath = image.startsWith('/') ? image : `/${image}`;
      return `${environment.urlBack}${cleanPath}`;
    }
    return image;
  }

  /**
   * Manejador de error para sustituir la imagen por el fallback predeterminado cuando falla la carga.
   * @param event Evento DOM nativo de error de carga.
   */
  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/imgs/commons/no-image.png';
  }

  /**
   * Maneja el input de búsqueda y emite la cadena de búsqueda al componente padre.
   * @param event Evento opcional del input de búsqueda.
   */
  onSearchInput(event?: Event) {
    if (!event) {
      this.searchQuery.emit('');
      return;
    }
    const query = (event.target as HTMLInputElement)?.value?.toLowerCase() || '';
    this.searchQuery.emit(query);
  }

  /**
   * Abre un alert de confirmación para registrar el avistamiento del ave seleccionada.
   * @param bird Ave seleccionada en el buscador.
   */
  async selectBird(bird: IBirdSearch) {
    const alert = await this.alertCtrl.create({
      header: 'Registrar Avistamiento',
      subHeader: bird['scientific_name'] as string,
      inputs: [
        { name: 'quantity', type: 'number', placeholder: 'Cantidad (Ej: 1)', min: 1, value: 1 },
        { name: 'details', type: 'text', placeholder: 'Detalles (ej: Comiendo frutas)' },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          /**
           * Procesa los datos del formulario del alert y emite el evento de avistamiento.
           * @param data Datos ingresados por el usuario en el alert.
           * @param data.quantity Cantidad de aves observadas.
           * @param data.details Descripci\u00f3n adicional del avistamiento.
           */
          handler: (data: {
            /** Cantidad de individuos observados */
            quantity: string;
            /** Notas o detalles del avistamiento */
            details: string;
          }) => {
            this.sightingAdded.emit({
              birdId: String(bird['id']),
              quantity: parseInt(data.quantity, 10) || 1,
              details: data.details || '',
              birdInfo: bird,
            });
            if (this.searchInputElement?.nativeElement) {
              this.searchInputElement.nativeElement.value = '';
            }
            this.searchQuery.emit('');
          },
        },
      ],
    });
    await alert.present();
  }
}
