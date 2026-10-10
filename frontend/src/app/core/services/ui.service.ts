import { inject, Injectable, signal } from '@angular/core';
import {
  ToastController,
  LoadingController,
  AlertController,
} from '@ionic/angular';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

/**
 * Servicio global para la gestión de UI con estado reactivo y feedback háptico.
 */
@Injectable({
  providedIn: 'root',
})
export class UiService {
  /**
   * Elemento documentado.
   */
  private readonly toastCtrl = inject(ToastController);
  /**
   * Elemento documentado.
   */
  private readonly loadingCtrl = inject(LoadingController);
  /**
   * Elemento documentado.
   */
  private readonly alertCtrl = inject(AlertController);

  /** Signal para rastrear procesos de carga en toda la app */
  public isGlobalLoading = signal<boolean>(false);

  /**
   *
   */
  private activeLoading: HTMLIonLoadingElement | null = null;

  /**
   * Muestra Toast y añade vibración ligera de éxito/información.
   * @param message
   * @param color
   * @param position
   */
  async showToast(
    message: string,
    color: 'success' | 'danger' | 'warning' | 'primary' = 'primary',
    position: 'top' | 'bottom' | 'middle' = 'bottom'
  ): Promise<void> {
    if (color === 'success')
      await Haptics.notification({ type: NotificationType.Success });

    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      color,
      position,
      buttons: [{ text: 'OK', role: 'cancel' }],
      cssClass: 'custom-toast',
    });
    await toast.present();
  }

  /**
   * Activa el spinner y el estado global de carga.
   * @param message
   */
  async showLoading(message: string = 'Cargando...'): Promise<void> {
    this.isGlobalLoading.set(true);
    if (this.activeLoading) await this.dismissLoading();

    this.activeLoading = await this.loadingCtrl.create({
      message,
      spinner: 'circles',
      backdropDismiss: false,
    });

    await this.activeLoading.present();
  }

  /**
   * Elemento documentado.
   */
  async dismissLoading(): Promise<void> {
    if (this.activeLoading) {
      await this.activeLoading.dismiss();
      this.activeLoading = null;
    }
    this.isGlobalLoading.set(false);
  }

  /**
   * Alerta crítica con vibración de advertencia.
   * @param header
   * @param message
   */
  async showAlert(header: string, message: string): Promise<void> {
    await Haptics.notification({ type: NotificationType.Warning });
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: [
        { text: 'Aceptar', role: 'confirm', cssClass: 'alert-button-confirm' },
      ],
    });
    await alert.present();
  }

  /**
   * Alerta de confirmación con opciones Aceptar/Cancelar.
   * @param header
   * @param message
   * @returns Promesa booleana con el resultado de la confirmación
   */
  async showConfirm(header: string, message: string): Promise<boolean> {
    await Haptics.impact({ style: ImpactStyle.Light });
    
    return new Promise(async (resolve) => {
      const alert = await this.alertCtrl.create({
        header,
        message,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'alert-button-cancel',
            /**
             * Elemento documentado.
             */
            handler: () => resolve(false),
          },
          {
            text: 'Eliminar',
            role: 'confirm',
            cssClass: 'alert-button-confirm',
            /**
             * Elemento documentado.
             */
            handler: () => resolve(true),
          },
        ],
      });
      await alert.present();
    });
  }
}
