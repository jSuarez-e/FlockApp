/* eslint-disable @typescript-eslint/no-floating-promises */
import { DataSource } from 'typeorm';
import {
  MedalEntity,
  MedalConditionType,
} from './src/infrastructure/entities/medal.entity';
import * as dotenv from 'dotenv';
dotenv.config();

// Configuración para el seed (soporta Neon / producción y desarrollo local)
const dbTarget = process.env.DB_TARGET || 'auto';
const databaseUrl = process.env.DATABASE_URL;
const useNeon =
  dbTarget === 'neon' || (dbTarget !== 'local' && Boolean(databaseUrl));

const dataSource = new DataSource({
  type: 'postgres',
  ...(useNeon && databaseUrl
    ? {
        url: databaseUrl,
        ssl: { rejectUnauthorized: false },
      }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_DATABASE || 'aviturismo_db',
      }),
  entities: [MedalEntity],
  synchronize: false, // No queremos alterar tablas de otras entidades accidentalmente
});

const initialMedals = [
  {
    name: 'Pionero',
    description: 'Medalla por crear la cuenta',
    condition_type: MedalConditionType.ACCOUNT_CREATED,
    condition_value: 1,
    iconUrl: 'assets/imgs/medals/account_created.png',
  },
  {
    name: 'Lealtad Cien',
    description: 'Medalla por usar la cuenta 100 días',
    condition_type: MedalConditionType.DAYS_ACTIVE,
    condition_value: 100,
    iconUrl: 'assets/imgs/medals/days_100.png',
  },
  {
    name: 'Primera Pluma',
    description: 'Medalla por registrar la primera ave',
    condition_type: MedalConditionType.BIRD_COUNT,
    condition_value: 1,
    iconUrl: 'assets/imgs/medals/bird_1.png',
  },
  {
    name: 'Observador Novato',
    description: 'Medalla por registrar 10 aves',
    condition_type: MedalConditionType.BIRD_COUNT,
    condition_value: 10,
    iconUrl: 'assets/imgs/medals/bird_10.png',
  },
  {
    name: 'Aficionado',
    description: 'Medalla por registrar 20 aves',
    condition_type: MedalConditionType.BIRD_COUNT,
    condition_value: 20,
    iconUrl: 'assets/imgs/medals/bird_20.png',
  },
  {
    name: 'Pajarero Frecuente',
    description: 'Medalla por registrar 30 aves',
    condition_type: MedalConditionType.BIRD_COUNT,
    condition_value: 30,
    iconUrl: 'assets/imgs/medals/bird_30.png',
  },
  {
    name: 'Explorador Menor',
    description: 'Medalla por registrar 40 aves',
    condition_type: MedalConditionType.BIRD_COUNT,
    condition_value: 40,
    iconUrl: 'assets/imgs/medals/bird_40.png',
  },
  {
    name: 'Explorador',
    description: 'Medalla por registrar 50 aves',
    condition_type: MedalConditionType.BIRD_COUNT,
    condition_value: 50,
    iconUrl: 'assets/imgs/medals/bird_50.png',
  },
  {
    name: 'Cien Aves',
    description: 'Medalla por registrar 100 aves',
    condition_type: MedalConditionType.BIRD_COUNT,
    condition_value: 100,
    iconUrl: 'assets/imgs/medals/bird_100.png',
  },
  {
    name: 'Doscientas Aves',
    description: 'Medalla por registrar 200 aves',
    condition_type: MedalConditionType.BIRD_COUNT,
    condition_value: 200,
    iconUrl: 'assets/imgs/medals/bird_200.png',
  },
  {
    name: 'Trecientas Aves',
    description: 'Medalla por registrar 300 aves',
    condition_type: MedalConditionType.BIRD_COUNT,
    condition_value: 300,
    iconUrl: 'assets/imgs/medals/bird_300.png',
  },
  {
    name: 'Cuatrocientas Aves',
    description: 'Medalla por registrar 400 aves',
    condition_type: MedalConditionType.BIRD_COUNT,
    condition_value: 400,
    iconUrl: 'assets/imgs/medals/bird_400.png',
  },
  {
    name: 'Quinientas Aves',
    description: 'Medalla por registrar 500 aves',
    condition_type: MedalConditionType.BIRD_COUNT,
    condition_value: 500,
    iconUrl: 'assets/imgs/medals/bird_500.png',
  },
  {
    name: 'Seiscientas Aves',
    description: 'Medalla por registrar 600 aves',
    condition_type: MedalConditionType.BIRD_COUNT,
    condition_value: 600,
    iconUrl: 'assets/imgs/medals/bird_600.png',
  },
  {
    name: 'Setecientas Aves',
    description: 'Medalla por registrar 700 aves',
    condition_type: MedalConditionType.BIRD_COUNT,
    condition_value: 700,
    iconUrl: 'assets/imgs/medals/bird_700.png',
  },
  {
    name: 'Ochocientas Aves',
    description: 'Medalla por registrar 800 aves',
    condition_type: MedalConditionType.BIRD_COUNT,
    condition_value: 800,
    iconUrl: 'assets/imgs/medals/bird_800.png',
  },
  {
    name: 'Novecientas Aves',
    description: 'Medalla por registrar 900 aves',
    condition_type: MedalConditionType.BIRD_COUNT,
    condition_value: 900,
    iconUrl: 'assets/imgs/medals/bird_900.png',
  },
  {
    name: 'Mil Aves',
    description: 'Medalla por registrar 1000 aves',
    condition_type: MedalConditionType.BIRD_COUNT,
    condition_value: 1000,
    iconUrl: 'assets/imgs/medals/bird_1000.png',
  },
  {
    name: 'Mil Quinientas Aves',
    description: 'Medalla por registrar 1500 aves',
    condition_type: MedalConditionType.BIRD_COUNT,
    condition_value: 1500,
    iconUrl: 'assets/imgs/medals/bird_1500.png',
  },
  {
    name: 'Veterano',
    description: 'Medalla por estar 365 días en la aplicación',
    condition_type: MedalConditionType.DAYS_ACTIVE,
    condition_value: 365,
    iconUrl: 'assets/imgs/medals/days_365.png',
  },
];

async function runSeed() {
  try {
    console.log('🔄 Conectando a PostgreSQL...');
    await dataSource.initialize();

    // Si la tabla no existe, la crea.
    await dataSource.synchronize();

    const medalRepo = dataSource.getRepository(MedalEntity);

    console.log('🗑️ Limpiando medallas antiguas (si aplica)...');
    await medalRepo.query('TRUNCATE TABLE medals CASCADE');

    console.log('🌱 Insertando 20 medallas fijas...');
    for (const data of initialMedals) {
      const medal = medalRepo.create(data);
      await medalRepo.save(medal);
    }

    console.log('✅ ¡Seeding de Medallas completado con éxito!');
  } catch (error) {
    console.error('❌ Error ejecutando seed:', error);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('🔌 Conexión cerrada.');
    }
  }
}

runSeed();
