# Diccionario de Archivos y Responsabilidades del Proyecto

Este documento mapea la ubicación de las piezas fundamentales de la arquitectura para permitir una consulta rápida y orientar a agentes e ingenieros.

## 1. Raíz y Configuración (Root)
- `docker-compose.yml`: Levanta la base de datos PostgreSQL junto a la extensión PostGIS para cálculos geoespaciales.
- `package.json`: Contiene las dependencias del monorepo, configuración de Hussein (Husky pre-commit hooks) y los comandos de auditoría/RAG.

## 2. Dominio: Frontend (`/frontend/src/app`)

### Almacenamiento Reactivo y Offline (`/core/stores`)
- `sync-queue.store.ts`: Motor principal del patrón Offline-First. Consume la API, vuelca catálogos (`guides`, `sites`, `birds`) a SQLite vía UPSERT, y mantiene el estado general de la última fecha de sincronización.
- `bird-search.store.ts`: Gestiona la búsqueda hiper-rápida en memoria RAM de las aves, consumiendo directamente la tabla `birds` a través de SQLite en su inicialización.
- `guide.store.ts`: Instancia de NgRx SignalStore que sirve el diccionario en memoria `O(1)` de las guías de turismo, cargadas desde SQLite.
- `site.store.ts`: Instancia de NgRx SignalStore que sirve el diccionario y la vista de detalle de los Sitios de aviturismo.

### Servicios Base (`/core/services`)
- `db-helper.service.ts`: Abstracción robusta para consultas SQL directas (`db.query`) sobre Capacitor SQLite. Usado para queries complejos como el cruce de Checklist de aves (`site_birds`).
- `ui.service.ts`: Centraliza la experiencia de usuario (Alertas nativas de Ionic) para aislar fallos de librerías externas (ej. SweetAlert2 en modo Standalone).

### Vistas y Páginas (`/pages`)
- `main-layout/`: Componente estructural superior. Posee el menú lateral desplegable (Navegación general hacia Dashboard, Aves, Mapa, Guías, Sitios y Perfil) y las pestañas inferiores (`ion-tabs`).
- `birds/bird-search/`: Buscador principal de especies integrado al SignalStore.
- `birds/sightings-map/`: Buscador geoespacial con renderizado Canvas de Leaflet. Incluye modales interactivos y combobox geográficos.
- `guides/guide-list/`: Listado de guías renderizado ultra-rápido utilizando `@angular/cdk/scrolling` (`cdk-virtual-scroll-viewport`) con modales de perfil.
- `sites/site-list/` & `sites/site-detail/`: Vistas maestras y detalle interactivo (Checklists relacionales SQLite).

## 3. Dominio: Backend (`/backend/src`)

### Estructura Core (`/infrastructure` y `/domain`)
- `infrastructure/modules/catalogs.module.ts`: Módulo NestJS que agrupa los endpoints de sincronización y listado offline.
- `infrastructure/controllers/sync.controller.ts`: Expone `/api/sync/catalogs`. Devuelve los Deltas (Upserts y Borrados Lógicos) basados en `last_modified`.
- `domain/services/sync.service.ts`: Interactúa con repositorios TypeORM para calcular las diferencias entre el tiempo de petición y la DB.

### Entidades de Persistencia (`/infrastructure/entities`)
- `site.entity.ts`: Representación de la tabla `sites`. Destaca la columna `location` de tipo `geometry(Point, 4326)` impulsada por PostGIS para cálculo métrico.
- `guide.entity.ts`: Representación de la tabla de Guías.

## 4. Dominio: Shared (`/shared`)
- `models/catalogs.interface.ts`: "La fuente de la verdad". DTOs exportados globalmente como `ISite`, `IGuide`, `ISyncCatalogsResponse` para mantener el estricto tipado estático cruzado entre NestJS (Responses) y Angular (Axios/Http Clients).

---
*Nota: Este documento debe ser actualizado a medida que la arquitectura escala, especialmente con la introducción de los plugins móviles nativos.*
