# [MEMORIA TÉCNICA Y AUDITORÍA INTEGRAL DE ARQUITECTURA FRONTEND]

> **Repositorio:** FlockApp (iBirdsColombia)  
> **Fecha de Auditoría:** 2026-10-13  
> **Equipo Auditor:** `architect_secops` | `code_reviewer` | `frontend`  
> **Alcance:** 100% de la carpeta `frontend/src/` (206 archivos de código analizados)  
> **Estado Global:** ⚠️ **EN REVISIÓN - REQUIERE SANEAMIENTO MODULAR**

---

## 1. RESUMEN EJECUTIVO Y MATRIZ DE CUMPLIMIENTO

Evaluación exhaustiva de los 7 pilares arquitectónicos exigidos por el gobierno del proyecto:

| # | Criterio de Auditoría | Estado | Hallazgos Clave | Severidad |
|---|---|:---:|---|:---:|
| **1** | **Separación de Triada (HTML, SCSS, TS)** | 🔴 **FALLIDO** | **10 componentes/páginas** tienen plantillas `template:` o estilos `styles:` incrustados en línea, careciendo de archivos `.html` y `.scss` independientes. | **ALTA** |
| **2** | **Clean Code, SOLID, KISS, DRY, SRP** | 🟡 **PARCIAL** | 54 archivos exceden 250 líneas. Componentes monolíticos (`sightings-map`, `business-profile`, `active-route.store`) acumulan múltiples responsabilidades (SRP violado). | **ALTA** |
| **3** | **Componentes Compartidos y Reusabilidad** | 🟡 **MEJORABLE** | Varios componentes en `pages/` (`sighting-card`, `role-selector`, modales de post) son genéricos y deben promoverse a `shared/components/` para reducir duplicación. | **MEDIA** |
| **4** | **No Duplicación de Código SCSS** | 🟡 **MEJORABLE** | Estilos de tarjetas, encabezados, badges y modales se reimplementan en SCSS locales en lugar de consumir clases utilitarias o componentes BEM base. | **MEDIA** |
| **5** | **Uso de Variables y Globales (`global.scss` / `variables.scss`)** | 🔴 **FALLIDO** | **928 instancias** de colores hexadecimales crudos (`#108346`, `#ffffff`, etc.) hardcodeados en SCSS locales en vez de `var(--ion-color-...)` o variables de tema. | **ALTA** |
| **6** | **Adopción de SignalStore y SignalsForms** | 🟢 **BUENA (90%)** | Excelente migración a `signalStore` de NgRx y Signals nativos. Se detectaron **4 llamadas manuales a `.subscribe()`** no migradas a `toSignal()`/`rxMethod`. | **MEDIA** |
| **7** | **Cero Atributos `style=""` en Plantillas HTML** | 🟢 **100% COMPLACE** | **0 violaciones.** Todas las plantillas HTML respetan la directiva y no poseen estilos en línea. | **VERDE** |
| **8** | **Metodología BEM en HTML y SCSS** | 🟡 **PARCIAL** | En componentes con estilos inline no existe BEM. En componentes existentes la estructura BEM es mayormente correcta, pero falta consistencia en modificadores. | **MEDIA** |

---

## 2. INVENTARIO DE INFRACCIONES CRÍTICAS (HALLAZGOS ARCHIVO POR ARCHIVO)

### 2.1. Violaciones de Separación de Triada (HTML/SCSS/TS)
Los siguientes componentes violan la directriz de separación estricta:

| Archivo TypeScript | HTML Independiente | SCSS Independiente | Causa de Infracción | Acción de Refactorización |
|---|:---:|:---:|---|---|
| `frontend/src/app/app.component.ts` | Existe | Existe | `template:` inline configurado en decorador | Vincular `templateUrl: './app.component.html'` |
| `frontend/src/app/pages/dashboard/components/feed-pajarero/components/create-feed-post/create-feed-post.component.ts` | ❌ Falta | ❌ Falta | `template` y `styles` inline (>170 líneas) | Extraer a `.html` y `.scss` con BEM |
| `frontend/src/app/pages/dashboard/components/feed-pajarero/components/post-replies/post-replies.component.ts` | ❌ Falta | ❌ Falta | `template` y `styles` inline (>350 líneas) | Extraer a `.html` y `.scss` con BEM |
| `frontend/src/app/pages/routes/route-workspace/components/map-tracker/map-tracker.component.ts` | ❌ Falta | Existe | `template` inline incrustado | Extraer a `map-tracker.component.html` |
| `frontend/src/app/shared/components/auth-card-header/auth-card-header.component.ts` | ❌ Falta | ❌ Falta | `template` y `styles` inline | Extraer a `.html` y `.scss` con BEM |
| `frontend/src/app/shared/components/brand-header/brand-header.component.ts` | ❌ Falta | ❌ Falta | `template` y `styles` inline | Extraer a `.html` y `.scss` con BEM |
| `frontend/src/app/shared/components/loading/loading.component.ts` | ❌ Falta | ❌ Falta | `template` y `styles` inline | Extraer a `.html` y `.scss` con BEM |
| `frontend/src/app/shared/components/otp-input/otp-input.component.ts` | ❌ Falta | ❌ Falta | `template` y `styles` inline | Extraer a `.html` y `.scss` con BEM |
| `frontend/src/app/shared/components/password-meter/password-meter.component.ts` | ❌ Falta | ❌ Falta | `template` y `styles` inline | Extraer a `.html` y `.scss` con BEM |
| `frontend/src/app/shared/components/stat-widget/stat-widget.component.ts` | ❌ Falta | ❌ Falta | `template` y `styles` inline | Extraer a `.html` y `.scss` con BEM |

---

### 2.2. Violaciones de Reactividad (`.subscribe()` No Permitidos)
| Archivo | Línea | Código | Riesgo | Corrección Mandataria |
|---|---|---|---|---|
| `pages/dashboard/.../post-replies.component.ts` | 282 | `.subscribe({ ... })` | Fuga de memoria / Estado fuera de Signal | Migrar a SignalStore o `rxMethod` |
| `pages/main-layout/main-layout.page.ts` | 174 | `.subscribe(() => { ... })` | Subscripción no reactiva | Migrar a `takeUntilDestroyed` o Signal reactivo |
| `pages/routes/.../route-workspace.page.ts` | 286 | `this.routeSub = this.route.queryParams.subscribe(...)` | Fuga potencial en navegación | Migrar a `toSignal(this.route.queryParams)` |
| `shared/components/otp-input/otp-input.component.ts` | 111 | `this.otpForm.valueChanges.pipe(...).subscribe(...)` | Uso reactivo híbrido | Usar `effect()` o Signals Form |

---

### 2.3. Auditoría de Archivos Monolíticos (> 250 líneas) y Deuda Técnica SRP
Top 10 archivos que requieren descomposición modular:
1. `core/stores/active-route.store.ts` (535 líneas) -> Separar en sub-stores (tracking, state, sync).
2. `core/services/db-helper.service.ts` (490 líneas) -> Extraer DAOs individuales por tabla.
3. `pages/birds/sightings-map/sightings-map.page.ts` (460 líneas) -> Extraer componentes de mapa, panel de avistamiento y filtros.
4. `pages/business-profile/business-profile.page.ts` (447 líneas) -> Extraer pestañas a componentes dedicados.
5. `core/stores/sync-queue.store.ts` (371 líneas) -> Extraer sincronizadores de red independientes.
6. `core/models/birds.interfaces.ts` (366 líneas) -> Dividir en contratos atómicos.
7. `pages/birds/components/bird-encyclopedia-view.component.ts` (317 líneas) -> Extraer tarjeta taxonómica y panel multimedia.
8. `pages/dashboard/dashboard.page.scss` (320 líneas) -> Migrar a variables CSS y clases compartidas.
9. `pages/profile/profile.page.scss` (285 líneas) -> Eliminar duplicación de selectores de avatar/cover.
10. `pages/routes/route-workspace/route-workspace.page.ts` (310 líneas) -> Delegar al `ActiveRouteStore`.

---

## 3. PLAN DE TRABAJO Y RUTA DE REMEDIACIÓN AL 100%

### 📌 FASE 1: Separación Estricta de Componentes (Triada HTML / SCSS / TS)
- **Objetivo:** 100% de componentes con archivos `.html`, `.scss` y `.ts` independientes.
- **Acciones:**
  1. Extraer los 6 componentes de `shared/components/` (`auth-card-header`, `brand-header`, `loading`, `otp-input`, `password-meter`, `stat-widget`).
  2. Extraer los componentes de `dashboard/components/feed-pajarero` (`create-feed-post`, `post-replies`).
  3. Extraer `map-tracker.component.ts` y conectar `app.component.ts` a su `app.component.html`.
  4. Aplicar metodología BEM en cada nuevo archivo SCSS generado.

### 📌 FASE 2: Saneamiento de Reactividad e Higiene de Signals
- **Objetivo:** Cero fugas de memoria, cero `.subscribe()` imperativos en vistas.
- **Acciones:**
  1. Migrar `post-replies` para delegar la carga al `FeedStore` mediante Signals.
  2. Reemplazar subscripción de `queryParams` en `route-workspace` por `toSignal()`.
  3. Reemplazar subscripción en `main-layout` por ciclo de vida Angular 21 `takeUntilDestroyed`.

### 📌 FASE 3: Estandarización de Variables de Diseño y SCSS Global
- **Objetivo:** Erradicar colores hexadecimales hardcodeados (`#108346`, `#4C6793`, etc.) reemplazándolos por tokens semánticos:
  - `var(--ion-color-primary)`
  - `var(--ion-color-secondary)`
  - `var(--ion-background-color)`
  - `var(--flock-border-radius)`
- **Acciones:**
  1. Auditar y reemplazar los 928 literales de color en hojas de estilo locales.
  2. Centralizar estilos comunes de tarjetas (`ion-card`), encabezados y chips en clases utilitarias de `global.scss`.

### 📌 FASE 4: Modularización y Refactorización SRP (Descomposición de Monolitos)
- **Objetivo:** Reducir la complejidad cognitiva y archivo > 250 líneas.
- **Acciones:**
  1. Descomponer `sightings-map.page.ts` en componentes Dumb hijos.
  2. Descomponer `business-profile.page.ts` en sub-vistas modulares.
  3. Modularizar `active-route.store.ts`.

### 📌 FASE 5: Verificación Continua con Quality Gates
- **Comandos de Validación:**
  - `npm run audit:all` (ESLint + Stylelint BEM)
  - `npm run audit:rules` (Cero any, cero styles inline, cero *ngIf)
  - `npm run test --prefix frontend`
  - `npm run brain:sync`
