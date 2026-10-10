/**
 * @sdd
 * [Objetivo]: Página de Configuración y Gestión de Permisos Android (Google Play Store compliance), donde el usuario puede auditar y modificar permisos de Cámara, Ubicación GPS y Multimedia.
 * [I/O - Reusabilidad]: Consume AppPermissionsService (Signals), NetworkService y UiService. Rutas asociadas: /home/settings.
 * [Edge Cases - UI]: Manejo de estados Concedido/Denegado/Pendiente, feedback táctil háptico y guía para permisos bloqueados en Ajustes de Android.
 */
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonContent,
  IonIcon,
  IonButton,
  IonChip,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  settingsOutline,
  cameraOutline,
  locationOutline,
  imagesOutline,
  shieldCheckmarkOutline,
  informationCircleOutline,
  checkmarkCircle,
  closeCircle,
  warningOutline,
  openOutline,
  wifiOutline,
  phonePortraitOutline,
  lockClosedOutline,
} from 'ionicons/icons';
import { AppPermissionsService, AppPermissionState } from '../../core/services/app-permissions.service';
import { NetworkService } from '../../core/services/network.service';
import { UiService } from '../../core/services/ui.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonContent,
    IonIcon,
    IonButton,
    IonChip,
  ],
})
/**
 * Componente principal de la página de Configuración y Gestión de Permisos.
 */
export class SettingsPage implements OnInit {
  /** Inyección del servicio de permisos */
  public readonly permissionsService = inject(AppPermissionsService);

  /** Inyección del servicio de red */
  public readonly networkService = inject(NetworkService);

  /** Inyección del servicio de UI para alertas */
  private readonly ui = inject(UiService);

  /**
   * Registra los iconos usados en la página de configuración.
   */
  constructor() {
    addIcons({
      settingsOutline,
      cameraOutline,
      locationOutline,
      imagesOutline,
      shieldCheckmarkOutline,
      informationCircleOutline,
      checkmarkCircle,
      closeCircle,
      warningOutline,
      openOutline,
      wifiOutline,
      phonePortraitOutline,
      lockClosedOutline,
    });
  }

  /**
   * Ciclo de vida: Refresca el estado de permisos al abrir la vista.
   */
  async ngOnInit(): Promise<void> {
    await this.permissionsService.checkAllPermissions();
  }

  /**
   * Solicita el permiso de cámara a través de la modal de revelación Google Play.
   */
  async requestCamera(): Promise<void> {
    const granted = await this.permissionsService.requestCameraWithRationale();
    if (granted) {
      await this.ui.showToast('Permiso de Cámara activado con éxito', 'success');
    }
  }

  /**
   * Solicita el permiso de ubicación GPS a través de la modal de revelación Google Play.
   */
  async requestLocation(): Promise<void> {
    const granted = await this.permissionsService.requestLocationWithRationale();
    if (granted) {
      await this.ui.showToast('Permiso de Ubicación (GPS) activado con éxito', 'success');
    }
  }

  /**
   * Solicita el permiso de galería de fotos.
   */
  async requestPhotos(): Promise<void> {
    const granted = await this.permissionsService.requestPhotosWithRationale();
    if (granted) {
      await this.ui.showToast('Permiso de Galería activado con éxito', 'success');
    }
  }

  /**
   * Muestra las instrucciones para modificar permisos en la configuración de Android.
   */
  async openSystemGuide(): Promise<void> {
    await this.permissionsService.showDeviceSettingsGuide('camera');
  }

  /**
   * Retorna la etiqueta legible del estado de un permiso.
   * @param status Estado consolidado del permiso
   * @returns Etiqueta amigable en español
   */
  getStatusLabel(status: AppPermissionState): string {
    switch (status) {
      case 'granted':
        return 'Permitido';
      case 'denied':
        return 'Denegado';
      case 'prompt':
      default:
        return 'Pendiente';
    }
  }
}
