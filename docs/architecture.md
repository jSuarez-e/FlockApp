# Arquitectura Global de iBirdsColombia

## 1. Visión General
iBirdsColombia es una aplicación orientada a la observación de aves (Aviturismo) construida bajo un enfoque estricto de **Spec-Driven Development (SDD)**, Clean Architecture y metodologías **Offline-First**. 

El sistema está dividido en fronteras de dominio estrictas (Monorepo):
- `/frontend`: Aplicación Móvil Híbrida / PWA.
- `/backend`: API RESTful.
- `/shared`: Contratos transversales y DTOs agnósticos.
- `/mobile-plugins`: Puentes nativos Capacitor (Kotlin/Swift) para hardware del dispositivo.

---

## 2. Pila Tecnológica (Stack)

### Frontend (Capa de Presentación y Datos Locales)
- **Framework Core**: Angular 21+ (Standalone Components, Control Flow `@if/@for`, Signals).
- **UI Framework**: Ionic 9+ Web Components.
- **Gestión de Estado (State Management)**: NgRx SignalStore (Señales reactivas granulares, acceso O(1) con `entityConfig`).
- **Base de Datos Local (Offline-First)**: Capacitor SQLite.
- **Mecanismo de Sync**: `SyncQueueStore` y Angular Interceptors para cacheo e hilos en background.
- **Estilos**: BEM Estricto con SASS.

### Backend (Capa de Negocio y Persistencia)
- **Framework Core**: NestJS.
- **ORM & Database**: TypeORM conectado a PostgreSQL.
- **Búsqueda Geoespacial**: Extensión **PostGIS** nativa (`geometry(Point, 4326)`) para búsqueda por radio de avistamientos y sitios.
- **Manejo de Errores**: Filtros de excepciones globales que devuelven Problem Details (RFC 7807) y evitan fuga de trazas en crudo.
- **Documentación API**: Swagger/OpenAPI auto-generado a partir de DTOs en `/shared`.

### Contratos Compartidos (Shared)
- **Patrón**: DTOs, Enums y Modelos agnósticos escritos en TypeScript puro, sirviendo como la "Verdad Absoluta" tanto para validadores de NestJS (`class-validator`) como para los modelos del Frontend.

---

## 3. Topología de Datos (Patrón Offline-First)

La aplicación depende de la capacidad de operar en locaciones remotas (bosques, selvas) sin red.

### 3.1 Sincronización Delta (Pull)
1. El backend mantiene un registro `last_modified` (TIMESTAMP) y un flag booleano `sql_deleted` para borrados lógicos.
2. El frontend (vía el `SyncQueueStore`) interroga al endpoint `/sync/catalogs?since={timestamp}`.
3. El backend retorna únicamente los registros insertados/actualizados y los IDs que fueron eliminados desde el último `timestamp`.
4. El Frontend aplica operaciones atómicas `UPSERT` y `DELETE` dentro de **Capacitor SQLite**.
5. Los `SignalStore` (Ej. `GuideStore`, `SiteStore`) recargan sus colecciones en memoria directamente de SQLite.

### 3.2 Cola de Acciones (Push)
1. Cuando el usuario registra un avistamiento sin conexión, se guarda como "Pendiente" en SQLite.
2. Al detectar red (Plugin Network), un background worker recorre la cola local e intenta un `POST /sightings`.
3. Si el backend responde con 2xx, el registro pasa de temporal a definitivo.

---

## 4. Gobernanza y RAG Loop
Todo código nuevo o componente reutilizable se sincroniza y envía a la base de conocimiento (`.gemini/brain`) usando herramientas automatizadas como `npm run brain:ask` y `npm run brain:sync` para que los Agentes Lógicos de Antigravity (Architect, Frontend, Backend) no alucinen o dupliquen el estado actual de la plataforma.
