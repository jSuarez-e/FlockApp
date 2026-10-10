import { Injectable, signal, NgZone, inject } from '@angular/core';
import { Network, ConnectionStatus } from '@capacitor/network';
import { logger } from '../utils/logger';

/**
 * @class NetworkService
 * Servicio core encargado de monitorear el estado de la conexión a internet
 * utilizando los listeners nativos de @capacitor/network. Provee un estado reactivo
 * mediante Signals para que la app conmute entre modo Online y Offline (R0).
 * @author Gemini (Orquestador SDD)
 */
@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  /** Inyección de NgZone para asegurar que los eventos nativos ejecuten el change detection */
  private readonly zone = inject(NgZone);

  /**
   * Signal reactivo que indica si el dispositivo está conectado a una red.
   * Se inicializa en true por defecto y se actualiza en el constructor.
   */
  public isOnline = signal<boolean>(true);

  /**
   * Inicializa el monitoreo de red de forma asíncrona.
   */
  constructor() {
    this.initializeNetworkMonitoring();
  }

  /**
   * Obtiene el estado inicial y registra el listener para cambios de conectividad.
   * @returns {Promise<void>}
   */
  private async initializeNetworkMonitoring(): Promise<void> {
    const status: ConnectionStatus = await Network.getStatus();
    this.isOnline.set(status.connected);

    Network.addListener('networkStatusChange', (status: ConnectionStatus) => {
      this.zone.run(() => {
        this.isOnline.set(status.connected);
        logger.debug(
          `[NetworkService] Conectividad cambiada: ${status.connected ? 'ONLINE' : 'OFFLINE'}`,
        );
      });
    });
  }
}
