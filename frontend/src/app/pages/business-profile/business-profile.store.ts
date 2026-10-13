import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { GuideService } from '../../core/services/guide.service';
import { GuideBookingService } from '../../core/services/guide-booking.service';
import { GeographyService, GeoLocation } from '../../core/services/geography.service';
import { UiService } from '../../core/services/ui.service';
import { UserService } from '../../core/services/user.service';
import { IUpdateGuideProfileDto } from '../../../../../shared/models/guide-profile.interface';
export { IGuideBooking, BookingStatus } from '../../../../../shared/models/guide-booking.interface';
import { IGuideBooking, BookingStatus } from '../../../../../shared/models/guide-booking.interface';
import { logger } from '../../core/utils/logger';

/**
 * Modelo de estado del perfil de negocio para proveedores de guianza.
 */
export interface BusinessProfileState {
  /** Indicador de carga general */
  isLoading: boolean;
  /** Pestaña activa en la vista */
  activeTab: 'profile' | 'calendar' | 'bookings';
  /** ID del guía o usuario */
  guideId: string;
  /** Nombre comercial o público */
  username: string;
  /** Nombres */
  firstName: string;
  /** Apellidos */
  lastName: string;
  /** Departamento de residencia */
  department: string;
  /** Municipio de residencia */
  municipality: string;
  /** Biografía o detalles de servicio */
  bio: string;
  /** Especialidad técnica o de aves */
  specialties: string;
  /** Especialidad personalizada */
  customSpecialty: string;
  /** URL foto de perfil */
  photoUrl: string;
  /** URL foto de portada */
  coverUrl: string;
  /** Número de teléfono de contacto */
  phone: string;
  /** Indica si el teléfono tiene WhatsApp */
  hasWhatsapp: boolean;
  /** Enlace o usuario de Instagram */
  instagram: string;
  /** Página web oficial */
  website: string;
  /** Correo de contacto */
  email: string;
  /** Idiomas dominados */
  languages: string;
  /** Registro Nacional de Turismo */
  rnt: string;
  /** Publicado en el directorio */
  isPublished: boolean;
  /** Indicador de intento de envío */
  isFormSubmitted: boolean;
  /** Lista de departamentos */
  departmentsList: GeoLocation[];
  /** Lista de municipios */
  municipalitiesList: GeoLocation[];
  /** Lista de fechas bloqueadas YYYY-MM-DD */
  blockedDates: string[];
  /** Lista de solicitudes de reserva recibidas */
  incomingBookings: IGuideBooking[];
  /** Indicador de carga de reservas */
  isLoadingBookings: boolean;
}

const initialState: BusinessProfileState = {
  isLoading: true,
  activeTab: 'profile',
  guideId: '',
  username: '',
  firstName: '',
  lastName: '',
  department: '',
  municipality: '',
  bio: '',
  specialties: '',
  customSpecialty: '',
  photoUrl: '',
  coverUrl: '',
  phone: '',
  hasWhatsapp: true,
  instagram: '',
  website: '',
  email: '',
  languages: 'Español',
  rnt: '',
  isPublished: true,
  isFormSubmitted: false,
  departmentsList: [],
  municipalitiesList: [],
  blockedDates: [],
  incomingBookings: [],
  isLoadingBookings: false,
};

/**
 * @sdd
 * @description SignalStore for Business Profile State Management.
 * @input UI actions (load, update field, save, change photo, toggle calendar dates, manage bookings)
 * @output Reactive state for the view.
 * @edgecases Handles loading states, data mapping, calendar blocking, and form validation status.
 */
export const BusinessProfileStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((
    state,
    guideService = inject(GuideService),
    bookingService = inject(GuideBookingService),
    geoService = inject(GeographyService),
    userService = inject(UserService),
    ui = inject(UiService)
  ) => ({
    /**
     * Actualiza un campo individual del estado.
     * @param field Clave del estado a modificar.
     * @param value Nuevo valor asignado al campo.
     */
    updateField<K extends keyof BusinessProfileState>(field: K, value: BusinessProfileState[K]) {
      patchState(state, { [field]: value });
    },
    /**
     * Cambia la pestaña activa del panel de proveedor.
     * @param tab Pestaña destino ('profile' | 'calendar' | 'bookings').
     */
    setActiveTab(tab: 'profile' | 'calendar' | 'bookings') {
      patchState(state, { activeTab: tab });
    },
    /**
     * Carga el catálogo de departamentos.
     */
    async loadCatalogs() {
      const depts = await geoService.getDepartments();
      patchState(state, { departmentsList: depts });
    },
    /**
     * Carga municipios filtrados según el departamento seleccionado.
     * @param departmentName Nombre del departamento.
     */
    async loadMunicipalities(departmentName: string) {
      const depts = state.departmentsList();
      const selectedDept = depts.find(d => d.name === departmentName);
      if (selectedDept) {
        const munis = await geoService.getMunicipalities(selectedDept.id);
        patchState(state, { municipalitiesList: munis });
      }
    },
    /**
     * Carga la información integral del perfil de guía y usuario.
     */
    async loadProfile() {
      patchState(state, { isLoading: true });
      try {
        const [guideData, userProfile] = await Promise.all([
          guideService.getMyGuideProfile().catch(() => null),
          userService.getProfile().catch(() => null),
        ]);

        const guideId =
          guideData?.id ||
          (userProfile?.id ? String(userProfile.id) : '');
        const fullName =
          guideData?.fullName ||
          userProfile?.businessName ||
          (userProfile
            ? `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim()
            : '');

        let parsedDept = '';
        let parsedMuni = '';
        if (guideData?.location && guideData.location.includes(',')) {
          const parts = guideData.location.split(',');
          parsedMuni = parts[0]?.trim() || '';
          parsedDept = parts[1]?.trim() || '';
        } else {
          parsedDept = userProfile?.department || '';
          parsedMuni = userProfile?.municipality || '';
        }

        const bio =
          guideData?.details || guideData?.bio || userProfile?.bio || '';
        const specialty = guideData?.specialty || '';
        const photoUrl =
          guideData?.photoUrl || userProfile?.avatarUrl || '';
        const coverUrl =
          guideData?.coverUrl || userProfile?.coverUrl || '';
        const phone = guideData?.phone || '';
        const hasWhatsapp = guideData?.hasWhatsapp ?? true;
        const instagram = guideData?.instagram || userProfile?.instagram || '';
        const website = guideData?.website || '';
        const email = guideData?.email || userProfile?.email || '';
        const languages = guideData?.languages || 'Español';
        const rnt = guideData?.rnt || userProfile?.rnt || '';
        const isPublished = guideData?.isPublished ?? true;

        patchState(state, {
          guideId,
          username: fullName,
          department: parsedDept,
          municipality: parsedMuni,
          bio,
          specialties: specialty,
          photoUrl,
          coverUrl,
          phone,
          hasWhatsapp,
          instagram,
          website,
          email,
          languages,
          rnt,
          isPublished,
        });

        if (parsedDept) {
          await this.loadMunicipalities(parsedDept);
        }

        if (guideId) {
          await this.loadAvailability(guideId);
          await this.loadIncomingBookings();
        }
      } catch (err) {
        logger.error('Error loading guide profile', err);
      } finally {
        patchState(state, { isLoading: false });
      }
    },
    /**
     * Consulta la disponibilidad del guía (fechas bloqueadas).
     * @param guideId ID opcional del guía.
     */
    async loadAvailability(guideId?: string) {
      const targetId = guideId || state.guideId();
      if (!targetId) return;
      try {
        const res = await bookingService.getGuideAvailability(targetId);
        patchState(state, { blockedDates: res.blockedDates || [] });
      } catch (err) {
        logger.error('Error loading availability', err);
      }
    },
    /**
     * Alterna el bloqueo o desbloqueo de una fecha en la agenda.
     * @param dateStr Fecha en formato YYYY-MM-DD.
     */
    async toggleBlockDate(dateStr: string) {
      const isBlocked = state.blockedDates().includes(dateStr);
      const action = isBlocked ? 'UNBLOCK' : 'BLOCK';
      try {
        await bookingService.setMyAvailability({
          dates: [dateStr],
          action,
          reason: isBlocked ? '' : 'Día ocupado / descanso',
        });
        const current = state.blockedDates();
        const updated = isBlocked
          ? current.filter((d) => d !== dateStr)
          : [...current, dateStr];
        patchState(state, { blockedDates: updated });
        ui.showToast(isBlocked ? `Fecha ${dateStr} liberada` : `Fecha ${dateStr} bloqueada`);
      } catch {
        ui.showToast('No se pudo actualizar la disponibilidad');
      }
    },
    /**
     * Obtiene el listado de solicitudes recibidas por el guía.
     */
    async loadIncomingBookings() {
      patchState(state, { isLoadingBookings: true });
      try {
        const bookings = await bookingService.getIncomingBookings();
        patchState(state, { incomingBookings: bookings, isLoadingBookings: false });
      } catch (err) {
        logger.error('Error loading incoming bookings', err);
        patchState(state, { isLoadingBookings: false });
      }
    },
    /**
     * Modifica el estado de una solicitud recibida.
     * @param bookingId ID de la reserva.
     * @param status Nuevo estado (CONFIRMED, REJECTED, COMPLETED).
     */
    async updateBookingStatus(bookingId: string, status: BookingStatus) {
      await ui.showLoading('Actualizando estado...');
      try {
        await bookingService.updateBookingStatus(bookingId, status);
        await ui.dismissLoading();
        ui.showToast(`Reserva actualizada a ${status}`);
        await this.loadIncomingBookings();
      } catch {
        await ui.dismissLoading();
        ui.showToast('Error al actualizar el estado de la reserva');
      }
    },
    /**
     * Guarda los cambios del perfil de proveedor en el backend.
     * @returns Indicador booleano de éxito de la operación.
     */
    async saveProfile() {
      patchState(state, { isFormSubmitted: true });
      const {
        username,
        department,
        municipality,
        bio,
        specialties,
        photoUrl,
        coverUrl,
        phone,
        hasWhatsapp,
        instagram,
        website,
        email,
        languages,
        rnt,
        isPublished,
      } = state;
      
      if (!username() || !department() || !municipality() || !bio()) {
        ui.showToast('Por favor completa los campos obligatorios (*)');
        return false;
      }
      
      await ui.showLoading('Guardando perfil de negocio...');
      try {
        const payload: IUpdateGuideProfileDto = {
          fullName: username(),
          department: department(),
          municipality: municipality(),
          details: bio(),
          specialty: specialties(),
          photoUrl: photoUrl(),
          coverUrl: coverUrl(),
          phone: phone(),
          hasWhatsapp: hasWhatsapp(),
          instagram: instagram(),
          website: website(),
          email: email(),
          languages: languages(),
          rnt: rnt(),
          isPublished: isPublished(),
        };
        await guideService.upsertMyGuideProfile(payload);
        await ui.dismissLoading();
        ui.showToast('Perfil de negocio actualizado correctamente');
        return true;
      } catch {
        await ui.dismissLoading();
        ui.showToast('Error al actualizar el perfil');
        return false;
      }
    }
  }))
);
