# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.1] - 2026-09-25

### Added
- **Módulo 2 (Guías y Sitios UX)**: 
  - `SiteDetailPage`: Implementación de checklist de aves relacional mediante `DbHelperService` y unIONES SQLite (Offline).
  - `GuideListPage`: Integración de perfiles modales dinámicos con botones de acción directa (WhatsApp).
- **Buscador Geoespacial UX**: Integración de ComboBox dinámico (`ion-modal`), carga de departamentos desde BD local y notificaciones mediante `UiService` para flujos vacíos.
- **Shared Interfaces**: Ampliación de las interfaces `IGuide` y `ISite` con soporte para `bio`, `languages`, `phone` y `photoUrl`.

## [0.2.0] - 2026-09-25


### Added
- **Módulo 2 (Buscadores, Guías y Sitios)**: Implementación de la base de datos offline-first y UI del catálogo.
- **Buscador Geoespacial (Mapa)**: Implementación de la vista aislada `SightingsMapPage` interactiva usando Leaflet, clustering y Modales dinámicos.
- **Frontend Stores**: Creación de `guide.store.ts`, `site.store.ts` y actualización de `sync-queue.store.ts` usando NgRx SignalStore.
- **Frontend UI**: Nuevas páginas de listado usando `cdk-virtual-scroll` para Guías y Sitios de Aviturismo.
- **Menú Global**: Enlaces rápidos incorporados al menú lateral de la app en `main-layout`.
- **Backend Sync**: Controlador y Servicio `SyncController` para manejar peticiones de deltas basados en un timestamp de "última modificación".
- **Backend PostGIS**: `SiteEntity` inicializado con la columna geoespacial `geometry(Point, 4326)` para soportar cálculos métricos.
- **Docs**: Inclusión de memoria arquitectónica (`architecture.md`) y diccionario de archivos (`project.md`).

### Fixed
- **Frontend Compiler**: Corrección del plugin esbuild de Angular removiendo la restricción `"rootDir"` para habilitar importaciones transversales desde la carpeta global `/shared`.
- **Docker**: Actualización limpia del `docker-compose.yml` para forzar la inicialización con la imagen geoespacial `postgis/postgis`.
- **Leaflet UI/UX**: Corrección del import obsoleto `~leaflet` en `global.scss` que rompía el bundler ESBuild, y solución del error de renderizado del Canvas con un timeout seguro de `.invalidateSize()`.

## [0.1.0] - Inicial

### Added
- Boilerplate Inicial de Monorepo (Frontend Angular + Ionic, Backend NestJS).
- Integración global de linting con configuraciones Husky + Eslint + SonarJS.
- Funcionalidades básicas de Identidad (Auth, Login, Registro).
