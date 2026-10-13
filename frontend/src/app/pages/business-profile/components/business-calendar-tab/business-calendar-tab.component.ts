/**
 * @sdd
 * [Objetivo]: Pestaña interactiva de calendario para bloqueo y disponibilidad de fechas del guía.
 * [I/O]: Inyecta BusinessProfileStore y UiService. Renderiza grilla de días con estado reactivo.
 * [Edge Cases]: Validación de fechas pasadas, bloqueo reactivo y navegación mensual segura.
 */
import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon, IonButton } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  chevronForwardOutline,
  timeOutline,
} from 'ionicons/icons';
import { BusinessProfileStore } from '../../business-profile.store';
import { UiService } from '../../../../core/services/ui.service';

/**
 * Estructura de presentación para cada celda de día en el calendario de proveedor.
 */
export interface CalendarDay {
  /** Número del día en el mes */
  dayNumber: number;
  /** Cadena de fecha en formato YYYY-MM-DD */
  dateString: string;
  /** Indica si la fecha está bloqueada */
  isBlocked: boolean;
  /** Indica si la fecha ya pasó */
  isPast: boolean;
  /** Indica si es el día de hoy */
  isToday: boolean;
}

/**
 * Componente presentador para la pestaña de agenda y calendario del guía.
 */
@Component({
  selector: 'app-business-calendar-tab',
  templateUrl: './business-calendar-tab.component.html',
  styleUrls: ['./business-calendar-tab.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, IonButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BusinessCalendarTabComponent {
  /** Inyección del store de perfil de negocio */
  public readonly store = inject(BusinessProfileStore);
  /** Servicio de UI para notificaciones toast */
  private readonly ui = inject(UiService);

  /** Fecha actual para navegación de calendario */
  public readonly currentCalendarMonth = signal<Date>(new Date());

  /** Días generados para el mes visible */
  public readonly calendarDays = computed<CalendarDay[]>(() => {
    const current = this.currentCalendarMonth();
    const year = current.getFullYear();
    const month = current.getMonth();
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const blocked = this.store.blockedDates();
    const days: CalendarDay[] = [];

    for (let day = 1; day <= daysInCurrentMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isPast = dateStr < todayStr;
      const isToday = dateStr === todayStr;
      const isBlocked = blocked.includes(dateStr);

      days.push({
        dayNumber: day,
        dateString: dateStr,
        isBlocked,
        isPast,
        isToday,
      });
    }

    return days;
  });

  /** Nombre del mes visible con año */
  public readonly currentMonthLabel = computed(() => {
    const date = this.currentCalendarMonth();
    return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  });

  /**
   * Registra los iconos usados en el calendario.
   */
  constructor() {
    addIcons({
      chevronBackOutline,
      chevronForwardOutline,
      timeOutline,
    });
  }

  /**
   * Navega al mes anterior en el calendario interactivo.
   */
  public prevMonth(): void {
    const cur = this.currentCalendarMonth();
    this.currentCalendarMonth.set(
      new Date(cur.getFullYear(), cur.getMonth() - 1, 1),
    );
  }

  /**
   * Navega al mes siguiente en el calendario interactivo.
   */
  public nextMonth(): void {
    const cur = this.currentCalendarMonth();
    this.currentCalendarMonth.set(
      new Date(cur.getFullYear(), cur.getMonth() + 1, 1),
    );
  }

  /**
   * Alterna el bloqueo o desbloqueo de un día en la agenda del guía.
   * @param day Día del calendario seleccionado.
   */
  public async toggleCalendarDay(day: CalendarDay): Promise<void> {
    if (day.isPast) {
      this.ui.showToast('No puedes bloquear o desbloquear fechas pasadas');
      return;
    }
    await this.store.toggleBlockDate(day.dateString);
  }
}
