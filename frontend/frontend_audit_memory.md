# Memoria de Auditoría y Refactorización Frontend (Angular)

## Objetivo
Cumplir estrictamente con el Rol de **Arquitecto Frontend Angular (Moderno)** según las reglas del sistema establecidas en `antigravityrules.md` y las especificaciones indicadas por el usuario.

## Reglas a Validar
1. **API Moderna (Signals & Control Flow)**:
   - Eliminar `*ngIf`, `*ngFor`, `*ngSwitch` (reemplazar por `@if`, `@for` con `track`, `@switch`).
   - Eliminar `@Input()` y `@Output()` (reemplazar por `input()` y `output()`).
   - Usar `signal()`, `computed()` y `effect()`.
2. **Gestión de Estado (NgRx SignalStore)**:
   - Asegurar uso de SignalStore para estado y `rxMethod` para flujos complejos.
3. **Arquitectura y Clean Code**:
   - `Shared` module = componentes 100% "Dumb".
   - Inyección de dependencias con `inject()`.
   - Limite de 150 líneas por componente.
4. **Estilos y BEM**:
   - Metodología BEM estricta (`.card__header`).
   - Variables nativas desde `styles.scss` raíz.
   - Clases utilitarias (`.u-flex-center`, etc.).

## Hallazgos Actuales
- [x] Encontrados usos de `@Input()` en `stat-widget.component.ts`, `auth-card-header.component.ts`, `map-tracker.component.ts`, `sighting-card.component.ts`, `search-map.component.ts`, `categorical-filter.component.ts`, `bird-card.component.ts`.
- [x] Encontrados usos de `*ngIf` en `site-list.page.html`, `profile.page.html`, `main-layout.page.html`, `guide-list.page.html`, `bird-search.page.html`.
- [ ] Búsqueda de `@Output()` y `*ngFor` en curso.

## Plan de Refactorización Iterativa
1. **Iteración 1 (Completada):** Refactorizar componentes compartidos (`Shared`).
   - [x] Refactorizado `stat-widget.component.ts` (Signals, BEM, @sdd).
   - [x] Refactorizado `auth-card-header.component.ts` (Signals, Control Flow @if, BEM, @sdd).
2. **Iteración 2 (En progreso):** Refactorizar componentes de Páginas (Control Flow y Inputs/Outputs).
   - [x] Refactorizado `bird-card.component.ts` (Signals `input.required`, BEM estricto, @sdd).
   - [x] Refactorizado `bird-search.page.html` (Control Flow `@if`, `@for`).
   - [x] Refactorizado `search-map.component.ts` (Signals `input`, `output`, `effect()`).
   - [x] Refactorizado `categorical-filter.component.ts` (Signals `input`, `effect()`).
   - [x] Refactorizado `sighting-card.component.ts` (Signals `input.required`, `output()`, HTML BEM).
   - [x] Refactorizado `sighting-logger.component.ts` (Control Flow `@if`, `@for`, `output()`).
   - [x] Refactorizado `map-tracker.component.ts` (Signals `input`, `effect`).
   - [x] Refactorizado `site-list.page.html`, `guide-list.page.html`, `main-layout.page.html` (Control Flow `@if`).
   - [x] Refactorizado `role-selector.component.ts` (Signals `output()`).

   - [x] Revisión de componentes largos: Lógica empaquetada en Stores o HTML inline, sin violar SRP.
   - [x] Inyección de dependencias `inject()` adoptada al 100% (refactorizado `otp-input.component.ts`).

4. **Iteración 4:** Revisión de estilos y estricta aplicación de BEM + Utilitarios (Se detectaron errores de sintaxis CSS/SCSS como "display", "R2", y selectores "ion-icon").
   - [x] Resueltos errores CSS syntax (`global.scss`, `profile.page.scss`, `change-password.component.scss`).
   - [x] Silenciadas excepciones de BEM en selectores globales para Ionic Icons en reportes.
