/**
 * @file init-queries.ts
 * @description Sentencias SQL para la inicialización del esquema offline (R0, R2).
 * Organizado jerárquicamente para evitar conflictos de Foreign Keys.
 */

export const BIRD_DATABASE_SCHEMA = [
  // --- NIVEL 0: Catálogos Independientes ---
  `CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY NOT NULL,
    description TEXT NOT NULL,
    last_modified INTEGER DEFAULT (strftime('%s', 'now')),
    sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))
  );`,

  `CREATE TABLE IF NOT EXISTS conservation_statuses (
    id INTEGER PRIMARY KEY NOT NULL,
    description TEXT NOT NULL,
    english_description TEXT NOT NULL,
    convention TEXT NOT NULL,
    image_url TEXT NOT NULL,
    last_modified INTEGER DEFAULT (strftime('%s', 'now')),
    sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))
  );`,

  `CREATE TABLE IF NOT EXISTS habitats (
    id INTEGER PRIMARY KEY NOT NULL,
    description TEXT NOT NULL,
    english_description TEXT NOT NULL,
    last_modified INTEGER DEFAULT (strftime('%s', 'now')),
    sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))
  );`,

  `CREATE TABLE IF NOT EXISTS residency_types (
    id INTEGER PRIMARY KEY NOT NULL,
    description TEXT NOT NULL,
    last_modified INTEGER DEFAULT (strftime('%s', 'now')),
    sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))
  );`,

  `CREATE TABLE IF NOT EXISTS feeding_types (
    id INTEGER PRIMARY KEY NOT NULL,
    description TEXT NOT NULL,
    last_modified INTEGER DEFAULT (strftime('%s', 'now')),
    sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))
  );`,

  `CREATE TABLE IF NOT EXISTS behavior_types (
    id INTEGER PRIMARY KEY NOT NULL,
    description TEXT NOT NULL,
    last_modified INTEGER DEFAULT (strftime('%s', 'now')),
    sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))
  );`,

  `CREATE TABLE IF NOT EXISTS beak_morphologies (
    id INTEGER PRIMARY KEY NOT NULL,
    description TEXT NOT NULL,
    last_modified INTEGER DEFAULT (strftime('%s', 'now')),
    sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))
  );`,

  `CREATE TABLE IF NOT EXISTS wing_morphologies (
    id INTEGER PRIMARY KEY NOT NULL,
    description TEXT NOT NULL,
    last_modified INTEGER DEFAULT (strftime('%s', 'now')),
    sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))
  );`,

  `CREATE TABLE IF NOT EXISTS tail_morphologies (
    id INTEGER PRIMARY KEY NOT NULL,
    description TEXT NOT NULL,
    last_modified INTEGER DEFAULT (strftime('%s', 'now')),
    sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))
  );`,

  `CREATE TABLE IF NOT EXISTS leg_morphologies (
    id INTEGER PRIMARY KEY NOT NULL,
    description TEXT NOT NULL,
    last_modified INTEGER DEFAULT (strftime('%s', 'now')),
    sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))
  );`,

  `CREATE TABLE IF NOT EXISTS additional_info (
    id INTEGER PRIMARY KEY NOT NULL,
    description TEXT NOT NULL,
    last_modified INTEGER DEFAULT (strftime('%s', 'now')),
    sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))
  );`,

  `CREATE TABLE IF NOT EXISTS departments (
    id INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    last_modified INTEGER DEFAULT (strftime('%s', 'now')),
    sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))
  );`,

  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    last_modified INTEGER DEFAULT (strftime('%s', 'now')),
    sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))
  );`,

  `CREATE TABLE IF NOT EXISTS guides (
    id TEXT PRIMARY KEY NOT NULL,
    full_name TEXT NOT NULL,
    location TEXT,
    specialty TEXT,
    rating REAL,
    photo_url TEXT,
    details TEXT,
    last_modified INTEGER DEFAULT (strftime('%s', 'now')),
    sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))
  );`,

  `CREATE TABLE IF NOT EXISTS sites (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    department TEXT,
    municipality TEXT,
    rating REAL DEFAULT 0,
    description TEXT,
    cover_url TEXT,
    logo_url TEXT,
    contact_phone TEXT,
    contact_whatsapp TEXT,
    website TEXT,
    instagram TEXT,
    facebook TEXT,
    has_bird_checklist BOOLEAN DEFAULT 0 CHECK (has_bird_checklist IN (0, 1)),
    geo_lat REAL,
    geo_lng REAL,
    route_json TEXT,
    last_modified INTEGER DEFAULT (strftime('%s', 'now')),
    sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))
  );`,

  `CREATE TABLE IF NOT EXISTS site_services (
    id TEXT PRIMARY KEY NOT NULL,
    site_id TEXT NOT NULL,
    type TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    photo_url TEXT,
    price REAL,
    last_modified INTEGER DEFAULT (strftime('%s', 'now')),
    sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1)),
    FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE
  );`,

  `CREATE TABLE IF NOT EXISTS site_birds (
    site_id TEXT NOT NULL,
    bird_id INTEGER NOT NULL,
    last_modified INTEGER DEFAULT (strftime('%s', 'now')),
    sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1)),
    PRIMARY KEY (site_id, bird_id)
  );`,

  // --- NIVEL 1: Tablas con una dependencia ---
  `CREATE TABLE IF NOT EXISTS families (
    id INTEGER PRIMARY KEY NOT NULL,
    description TEXT NOT NULL,
    order_id INTEGER NOT NULL,
    total_birds INTEGER DEFAULT 0,
    bird_types TEXT,
    last_modified INTEGER DEFAULT (strftime('%s', 'now')),
    sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1)),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
  );`,

  `CREATE TABLE IF NOT EXISTS municipalities (
    id INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    state TEXT NOT NULL,
    department_id INTEGER NOT NULL,
    last_modified INTEGER DEFAULT (strftime('%s', 'now')),
    sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1)),
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
  );`,

  // --- NIVEL 2: La Tabla Maestra (birds) ---
  `CREATE TABLE IF NOT EXISTS birds (
    id INTEGER PRIMARY KEY NOT NULL,
    scientific_name TEXT NOT NULL,
    english_name TEXT NOT NULL,
    common_name TEXT NOT NULL,
    min_altitude INTEGER NOT NULL DEFAULT 0,
    max_altitude INTEGER NOT NULL DEFAULT 0,
    viewing_difficulty INTEGER NOT NULL DEFAULT 4,
    size INTEGER,
    environment TEXT,
    behavior TEXT,
    colors TEXT,
    authority TEXT,
    gbif_link TEXT,
    wikiaves_link TEXT,
    ebird_link TEXT,
    other_sources TEXT,
    base_image TEXT,
    image_copyright TEXT,
    habitat_id INTEGER NOT NULL,
    conservation_status_id INTEGER NOT NULL,
    family_id INTEGER NOT NULL,
    residency_type_id INTEGER NOT NULL,
    feeding_type_id INTEGER NOT NULL,
    beak_morphology_id INTEGER NOT NULL,
    wing_morphology_id INTEGER NOT NULL,
    tail_morphology_id INTEGER NOT NULL,
    leg_morphology_id INTEGER NOT NULL,
    additional_info_id INTEGER NOT NULL,
    last_modified INTEGER DEFAULT (strftime('%s', 'now')),
    sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1)),
    FOREIGN KEY (habitat_id) REFERENCES habitats(id) ON DELETE CASCADE,
    FOREIGN KEY (conservation_status_id) REFERENCES conservation_statuses(id) ON DELETE CASCADE,
    FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE,
    FOREIGN KEY (residency_type_id) REFERENCES residency_types(id) ON DELETE CASCADE,
    FOREIGN KEY (feeding_type_id) REFERENCES feeding_types(id) ON DELETE CASCADE,
    FOREIGN KEY (beak_morphology_id) REFERENCES beak_morphologies(id) ON DELETE CASCADE,
    FOREIGN KEY (wing_morphology_id) REFERENCES wing_morphologies(id) ON DELETE CASCADE,
    FOREIGN KEY (tail_morphology_id) REFERENCES tail_morphologies(id) ON DELETE CASCADE,
    FOREIGN KEY (leg_morphology_id) REFERENCES leg_morphologies(id) ON DELETE CASCADE,
    FOREIGN KEY (additional_info_id) REFERENCES additional_info(id) ON DELETE CASCADE
  );`,

  // --- NIVEL 3: Relaciones Finales y Actividad ---
  `CREATE TABLE IF NOT EXISTS sightings (
    id INTEGER PRIMARY KEY NOT NULL,
    bird_image TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    bird_id INTEGER NOT NULL,
    latitude REAL,
    longitude REAL,
    last_modified INTEGER DEFAULT (strftime('%s', 'now')),
    sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1)),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (bird_id) REFERENCES birds(id) ON DELETE CASCADE
  );`,

  `CREATE TABLE IF NOT EXISTS bird_departments (
    id INTEGER PRIMARY KEY NOT NULL,
    bird_id INTEGER NOT NULL,
    department_id INTEGER NOT NULL,
    last_modified INTEGER DEFAULT (strftime('%s', 'now')),
    sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1)),
    FOREIGN KEY (bird_id) REFERENCES birds(id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
  );`,

  `CREATE TABLE IF NOT EXISTS routes (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    start_time TEXT NOT NULL,
    end_time TEXT,
    route_type TEXT,
    total_km REAL DEFAULT 0,
    duration_mins INTEGER DEFAULT 0,
    path_geojson TEXT,
    name TEXT,
    comments TEXT,
    status TEXT DEFAULT 'DRAFT',
    sync_status TEXT DEFAULT 'pending_sync',
    department_id INTEGER,
    municipality_id INTEGER,
    last_modified INTEGER DEFAULT (strftime('%s', 'now')),
    sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))
  );`,

  `CREATE TABLE IF NOT EXISTS route_sightings (
    id TEXT PRIMARY KEY,
    route_id TEXT NOT NULL,
    bird_id TEXT NOT NULL,
    lat REAL NOT NULL,
    lng REAL NOT NULL,
    timestamp TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    details TEXT,
    sync_status TEXT DEFAULT 'pending_sync',
    last_modified INTEGER DEFAULT (strftime('%s', 'now')),
    sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1)),
    FOREIGN KEY(route_id) REFERENCES routes(id)
  );`,

  // --- OPTIMIZACIÓN: Índices ---
  `CREATE INDEX IF NOT EXISTS idx_birds_scientific_name ON birds (scientific_name);`,
  `CREATE INDEX IF NOT EXISTS idx_birds_english_name ON birds (english_name);`,
  `CREATE INDEX IF NOT EXISTS idx_routes_user_id ON routes (user_id);`,
];
