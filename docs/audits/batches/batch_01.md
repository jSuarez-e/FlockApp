# [SYSTEM OVERRIDE: ATOMIC REFACTORING MODE - BATCH 1]

**CONTEXTO:**
Actúa como el Ingeniero de Software Lead. Tienes la tarea de resolver las violaciones de código detectadas por ESLint (TypeScript/Lógica) y Stylelint (CSS/SCSS bajo metodología BEM) bajo las reglas estrictas de `.antigravityrules`.

**DIRECTIVAS DE EJECUCIÓN:**
1. Resuelve ÚNICAMENTE los errores listados en este lote para cada archivo correspondiente.
2. Si el archivo es TypeScript y el error es `jsdoc/require-jsdoc`, genera la documentación JSDoc correcta (`@param`, `@returns`).
3. Si el error es `no-explicit-any`, infiere el tipo correcto o usa `unknown`/genéricos.
4. Si el archivo es CSS/SCSS, asegúrate de corregir los selectores o reglas para que cumplan estrictamente con la metodología BEM (`.block__element--modifier`) y elimina estilos inline si los hubiera.
5. NO devuelvas el archivo completo. Utiliza `// ... existing code` y muestra solo los bloques modificados con su ruta en la primera línea.

**ERRORES A RESOLVER EN ESTE LOTE:**
```json
[
  {
    "file": "backend/check.ts",
    "errors": [
      "Línea 7: [@typescript-eslint/no-unsafe-assignment] Unsafe assignment of an error typed value.",
      "Línea 7: [@typescript-eslint/no-unsafe-call] Unsafe construction of a type that could not be resolved.",
      "Línea 15: [@typescript-eslint/no-unsafe-call] Unsafe call of a type that could not be resolved.",
      "Línea 15: [@typescript-eslint/no-unsafe-member-access] Unsafe member access .connect on a type that cannot be resolved.",
      "Línea 18: [@typescript-eslint/no-unsafe-assignment] Unsafe assignment of an error typed value.",
      "Línea 18: [@typescript-eslint/no-unsafe-call] Unsafe call of a type that could not be resolved.",
      "Línea 18: [@typescript-eslint/no-unsafe-member-access] Unsafe member access .query on a type that cannot be resolved.",
      "Línea 18: [prettier/prettier] Replace `'SELECT·COUNT(*)·FROM·birds;'` with `⏎······'SELECT·COUNT(*)·FROM·birds;',⏎····`",
      "Línea 19: [@typescript-eslint/no-unsafe-member-access] Unsafe member access .rows on a type that cannot be resolved.",
      "Línea 20: [@typescript-eslint/no-unsafe-assignment] Unsafe assignment of an error typed value.",
      "Línea 20: [@typescript-eslint/no-unsafe-call] Unsafe call of a type that could not be resolved.",
      "Línea 20: [@typescript-eslint/no-unsafe-member-access] Unsafe member access .query on a type that cannot be resolved.",
      "Línea 20: [prettier/prettier] Replace `'SELECT·COUNT(*)·FROM·departments;'` with `⏎······'SELECT·COUNT(*)·FROM·departments;',⏎····`",
      "Línea 21: [@typescript-eslint/no-unsafe-member-access] Unsafe member access .rows on a type that cannot be resolved.",
      "Línea 25: [@typescript-eslint/no-unsafe-call] Unsafe call of a type that could not be resolved.",
      "Línea 25: [@typescript-eslint/no-unsafe-member-access] Unsafe member access .end on a type that cannot be resolved."
    ]
  },
  {
    "file": "backend/fix-routes.ts",
    "errors": [
      "Línea 7: [@typescript-eslint/no-unsafe-assignment] Unsafe assignment of an error typed value.",
      "Línea 7: [@typescript-eslint/no-unsafe-call] Unsafe construction of a type that could not be resolved.",
      "Línea 15: [@typescript-eslint/no-unsafe-call] Unsafe call of a type that could not be resolved.",
      "Línea 15: [@typescript-eslint/no-unsafe-member-access] Unsafe member access .connect on a type that cannot be resolved.",
      "Línea 18: [@typescript-eslint/no-unsafe-assignment] Unsafe assignment of an error typed value.",
      "Línea 18: [@typescript-eslint/no-unsafe-call] Unsafe call of a type that could not be resolved.",
      "Línea 18: [@typescript-eslint/no-unsafe-member-access] Unsafe member access .query on a type that cannot be resolved.",
      "Línea 18: [prettier/prettier] Replace `'SELECT·COUNT(*)·FROM·routes;'` with `⏎······'SELECT·COUNT(*)·FROM·routes;',⏎····`",
      "Línea 19: [@typescript-eslint/no-unsafe-member-access] Unsafe member access .rows on a type that cannot be resolved.",
      "Línea 23: [@typescript-eslint/no-unsafe-call] Unsafe call of a type that could not be resolved.",
      "Línea 23: [@typescript-eslint/no-unsafe-member-access] Unsafe member access .end on a type that cannot be resolved."
    ]
  },
  {
    "file": "backend/import-seed.ts",
    "errors": [
      "Línea 6: [prettier/prettier] Replace `__dirname,·'../frontend/src/assets/db/db-aves.json'` with `⏎····__dirname,⏎····'../frontend/src/assets/db/db-aves.json',⏎··`",
      "Línea 7: [@typescript-eslint/no-unsafe-assignment] Unsafe assignment of an `any` value.",
      "Línea 9: [@typescript-eslint/no-unsafe-assignment] Unsafe assignment of an error typed value.",
      "Línea 9: [@typescript-eslint/no-unsafe-call] Unsafe construction of a type that could not be resolved.",
      "Línea 17: [@typescript-eslint/no-unsafe-call] Unsafe call of a type that could not be resolved.",
      "Línea 17: [@typescript-eslint/no-unsafe-member-access] Unsafe member access .connect on a type that cannot be resolved.",
      "Línea 20: [@typescript-eslint/no-unsafe-member-access] Unsafe member access .tables on an `any` value.",
      "Línea 21: [@typescript-eslint/no-unsafe-member-access] Unsafe member access .values on an `any` value.",
      "Línea 21: [@typescript-eslint/no-unsafe-member-access] Unsafe member access .values on an `any` value.",
      "Línea 22: [prettier/prettier] Delete `······`",
      "Línea 23: [@typescript-eslint/no-unsafe-assignment] Unsafe assignment of an `any` value.",
      "Línea 23: [@typescript-eslint/no-unsafe-member-access] Unsafe member access .name on an `any` value.",
      "Línea 34: [@typescript-eslint/no-unsafe-call] Unsafe call of an `any` typed value.",
      "Línea 34: [@typescript-eslint/no-unsafe-member-access] Unsafe member access .schema on an `any` value.",
      "Línea 35: [@typescript-eslint/no-unsafe-assignment] Unsafe assignment of an `any` value.",
      "Línea 35: [@typescript-eslint/no-unsafe-member-access] Unsafe member access .column on an `any` value.",
      "Línea 41: [prettier/prettier] Insert `⏎·········`",
      "Línea 44: [prettier/prettier] Delete `········`",
      "Línea 45: [@typescript-eslint/no-unsafe-argument] Unsafe argument of type `any` assigned to a parameter of type `string`.",
      "Línea 49: [@typescript-eslint/no-unsafe-member-access] Unsafe member access .values on an `any` value.",
      "Línea 51: [@typescript-eslint/no-unsafe-member-access] Unsafe member access .values on an `any` value.",
      "Línea 54: [@typescript-eslint/no-unsafe-assignment] Unsafe assignment of an `any` value.",
      "Línea 54: [@typescript-eslint/no-unsafe-member-access] Unsafe member access [idx] on an `any` value.",
      "Línea 58: [prettier/prettier] Delete `·`",
      "Línea 61: [prettier/prettier] Delete `··········`",
      "Línea 63: [prettier/prettier] Delete `·`",
      "Línea 64: [prettier/prettier] Replace `·if·(colName·===·'min_altitude'·||·colName·===·'max_altitude')` with `if·(colName·===·'min_altitude'·||·colName·===·'max_altitude')⏎·············`",
      "Línea 65: [prettier/prettier] Delete `·`",
      "Línea 66: [prettier/prettier] Replace `·if·(colName·===·'common_name'·||·colName·===·'english_name'·||·colName·===·'scientific_name')` with `if·(⏎··············colName·===·'common_name'·||⏎··············colName·===·'english_name'·||⏎··············colName·===·'scientific_name'⏎············)⏎·············`",
      "Línea 67: [prettier/prettier] Delete `·`",
      "Línea 70: [@typescript-eslint/no-unsafe-return] Unsafe return of a value of type `any`.",
      "Línea 73: [prettier/prettier] Replace `.map((_:·any,·i:·number)·=>·`$${i·+·1}`)` with `⏎··········.map((_:·any,·i:·number)·=>·`$${i·+·1}`)⏎··········`",
      "Línea 74: [prettier/prettier] Replace `c` with `(c)`",
      "Línea 76: [prettier/prettier] Delete `········`",
      "Línea 78: [@typescript-eslint/no-unsafe-call] Unsafe call of a type that could not be resolved.",
      "Línea 78: [@typescript-eslint/no-unsafe-member-access] Unsafe member access .query on a type that cannot be resolved.",
      "Línea 82: [@typescript-eslint/no-unsafe-member-access] Unsafe member access .message on an `any` value.",
      "Línea 91: [@typescript-eslint/no-unsafe-call] Unsafe call of a type that could not be resolved.",
      "Línea 91: [@typescript-eslint/no-unsafe-member-access] Unsafe member access .end on a type that cannot be resolved.",
      "Línea 95: [@typescript-eslint/no-floating-promises] Promises must be awaited, end with a call to .catch, end with a call to .then with a rejection handler or be explicitly marked as ignored with the `void` operator."
    ]
  },
  {
    "file": "backend/seed-medals.ts",
    "errors": [
      "Línea 2: [prettier/prettier] Replace `·MedalEntity,·MedalConditionType·` with `⏎··MedalEntity,⏎··MedalConditionType,⏎`",
      "Línea 19: [prettier/prettier] Replace `·name:·'Pionero',·description:·'Medalla·por·crear·la·cuenta',·condition_type:·MedalConditionType.ACCOUNT_CREATED,·condition_value:·1,·iconUrl:·'assets/imgs/medals/account_created.png'` with `⏎····name:·'Pionero',⏎····description:·'Medalla·por·crear·la·cuenta',⏎····condition_type:·MedalConditionType.ACCOUNT_CREATED,⏎····condition_value:·1,⏎····iconUrl:·'assets/imgs/medals/account_created.png',⏎·`",
      "Línea 20: [prettier/prettier] Replace `·name:·'Lealtad·Cien',·description:·'Medalla·por·usar·la·cuenta·100·días',·condition_type:·MedalConditionType.DAYS_ACTIVE,·condition_value:·100,·iconUrl:·'assets/imgs/medals/days_100.png'` with `⏎····name:·'Lealtad·Cien',⏎····description:·'Medalla·por·usar·la·cuenta·100·días',⏎····condition_type:·MedalConditionType.DAYS_ACTIVE,⏎····condition_value:·100,⏎····iconUrl:·'assets/imgs/medals/days_100.png',⏎·`",
      "Línea 21: [prettier/prettier] Replace `·name:·'Primera·Pluma',·description:·'Medalla·por·registrar·la·primera·ave',·condition_type:·MedalConditionType.BIRD_COUNT,·condition_value:·1,·iconUrl:·'assets/imgs/medals/bird_1.png'` with `⏎····name:·'Primera·Pluma',⏎····description:·'Medalla·por·registrar·la·primera·ave',⏎····condition_type:·MedalConditionType.BIRD_COUNT,⏎····condition_value:·1,⏎····iconUrl:·'assets/imgs/medals/bird_1.png',⏎·`",
      "Línea 22: [prettier/prettier] Replace `·name:·'Observador·Novato',·description:·'Medalla·por·registrar·10·aves',·condition_type:·MedalConditionType.BIRD_COUNT,·condition_value:·10,·iconUrl:·'assets/imgs/medals/bird_10.png'` with `⏎····name:·'Observador·Novato',⏎····description:·'Medalla·por·registrar·10·aves',⏎····condition_type:·MedalConditionType.BIRD_COUNT,⏎····condition_value:·10,⏎····iconUrl:·'assets/imgs/medals/bird_10.png',⏎·`",
      "Línea 23: [prettier/prettier] Replace `·name:·'Aficionado',·description:·'Medalla·por·registrar·20·aves',·condition_type:·MedalConditionType.BIRD_COUNT,·condition_value:·20,·iconUrl:·'assets/imgs/medals/bird_20.png'` with `⏎····name:·'Aficionado',⏎····description:·'Medalla·por·registrar·20·aves',⏎····condition_type:·MedalConditionType.BIRD_COUNT,⏎····condition_value:·20,⏎····iconUrl:·'assets/imgs/medals/bird_20.png',⏎·`",
      "Línea 24: [prettier/prettier] Replace `·name:·'Pajarero·Frecuente',·description:·'Medalla·por·registrar·30·aves',·condition_type:·MedalConditionType.BIRD_COUNT,·condition_value:·30,·iconUrl:·'assets/imgs/medals/bird_30.png'` with `⏎····name:·'Pajarero·Frecuente',⏎····description:·'Medalla·por·registrar·30·aves',⏎····condition_type:·MedalConditionType.BIRD_COUNT,⏎····condition_value:·30,⏎····iconUrl:·'assets/imgs/medals/bird_30.png',⏎·`",
      "Línea 25: [prettier/prettier] Replace `·name:·'Explorador·Menor',·description:·'Medalla·por·registrar·40·aves',·condition_type:·MedalConditionType.BIRD_COUNT,·condition_value:·40,·iconUrl:·'assets/imgs/medals/bird_40.png'` with `⏎····name:·'Explorador·Menor',⏎····description:·'Medalla·por·registrar·40·aves',⏎····condition_type:·MedalConditionType.BIRD_COUNT,⏎····condition_value:·40,⏎····iconUrl:·'assets/imgs/medals/bird_40.png',⏎·`",
      "Línea 26: [prettier/prettier] Replace `·name:·'Explorador',·description:·'Medalla·por·registrar·50·aves',·condition_type:·MedalConditionType.BIRD_COUNT,·condition_value:·50,·iconUrl:·'assets/imgs/medals/bird_50.png'` with `⏎····name:·'Explorador',⏎····description:·'Medalla·por·registrar·50·aves',⏎····condition_type:·MedalConditionType.BIRD_COUNT,⏎····condition_value:·50,⏎····iconUrl:·'assets/imgs/medals/bird_50.png',⏎·`",
      "Línea 27: [prettier/prettier] Replace `·name:·'Cien·Aves',·description:·'Medalla·por·registrar·100·aves',·condition_type:·MedalConditionType.BIRD_COUNT,·condition_value:·100,·iconUrl:·'assets/imgs/medals/bird_100.png'` with `⏎····name:·'Cien·Aves',⏎····description:·'Medalla·por·registrar·100·aves',⏎····condition_type:·MedalConditionType.BIRD_COUNT,⏎····condition_value:·100,⏎····iconUrl:·'assets/imgs/medals/bird_100.png',⏎·`",
      "Línea 28: [prettier/prettier] Replace `·name:·'Doscientas·Aves',·description:·'Medalla·por·registrar·200·aves',·condition_type:·MedalConditionType.BIRD_COUNT,·condition_value:·200,·iconUrl:·'assets/imgs/medals/bird_200.png'` with `⏎····name:·'Doscientas·Aves',⏎····description:·'Medalla·por·registrar·200·aves',⏎····condition_type:·MedalConditionType.BIRD_COUNT,⏎····condition_value:·200,⏎····iconUrl:·'assets/imgs/medals/bird_200.png',⏎·`",
      "Línea 29: [prettier/prettier] Replace `·name:·'Trecientas·Aves',·description:·'Medalla·por·registrar·300·aves',·condition_type:·MedalConditionType.BIRD_COUNT,·condition_value:·300,·iconUrl:·'assets/imgs/medals/bird_300.png'` with `⏎····name:·'Trecientas·Aves',⏎····description:·'Medalla·por·registrar·300·aves',⏎····condition_type:·MedalConditionType.BIRD_COUNT,⏎····condition_value:·300,⏎····iconUrl:·'assets/imgs/medals/bird_300.png',⏎·`",
      "Línea 30: [prettier/prettier] Replace `·name:·'Cuatrocientas·Aves',·description:·'Medalla·por·registrar·400·aves',·condition_type:·MedalConditionType.BIRD_COUNT,·condition_value:·400,·iconUrl:·'assets/imgs/medals/bird_400.png'` with `⏎····name:·'Cuatrocientas·Aves',⏎····description:·'Medalla·por·registrar·400·aves',⏎····condition_type:·MedalConditionType.BIRD_COUNT,⏎····condition_value:·400,⏎····iconUrl:·'assets/imgs/medals/bird_400.png',⏎·`",
      "Línea 31: [prettier/prettier] Replace `·name:·'Quinientas·Aves',·description:·'Medalla·por·registrar·500·aves',·condition_type:·MedalConditionType.BIRD_COUNT,·condition_value:·500,·iconUrl:·'assets/imgs/medals/bird_500.png'` with `⏎····name:·'Quinientas·Aves',⏎····description:·'Medalla·por·registrar·500·aves',⏎····condition_type:·MedalConditionType.BIRD_COUNT,⏎····condition_value:·500,⏎····iconUrl:·'assets/imgs/medals/bird_500.png',⏎·`",
      "Línea 32: [prettier/prettier] Replace `·name:·'Seiscientas·Aves',·description:·'Medalla·por·registrar·600·aves',·condition_type:·MedalConditionType.BIRD_COUNT,·condition_value:·600,·iconUrl:·'assets/imgs/medals/bird_600.png'` with `⏎····name:·'Seiscientas·Aves',⏎····description:·'Medalla·por·registrar·600·aves',⏎····condition_type:·MedalConditionType.BIRD_COUNT,⏎····condition_value:·600,⏎····iconUrl:·'assets/imgs/medals/bird_600.png',⏎·`",
      "Línea 33: [prettier/prettier] Replace `·name:·'Setecientas·Aves',·description:·'Medalla·por·registrar·700·aves',·condition_type:·MedalConditionType.BIRD_COUNT,·condition_value:·700,·iconUrl:·'assets/imgs/medals/bird_700.png'` with `⏎····name:·'Setecientas·Aves',⏎····description:·'Medalla·por·registrar·700·aves',⏎····condition_type:·MedalConditionType.BIRD_COUNT,⏎····condition_value:·700,⏎····iconUrl:·'assets/imgs/medals/bird_700.png',⏎·`",
      "Línea 34: [prettier/prettier] Replace `·name:·'Ochocientas·Aves',·description:·'Medalla·por·registrar·800·aves',·condition_type:·MedalConditionType.BIRD_COUNT,·condition_value:·800,·iconUrl:·'assets/imgs/medals/bird_800.png'` with `⏎····name:·'Ochocientas·Aves',⏎····description:·'Medalla·por·registrar·800·aves',⏎····condition_type:·MedalConditionType.BIRD_COUNT,⏎····condition_value:·800,⏎····iconUrl:·'assets/imgs/medals/bird_800.png',⏎·`",
      "Línea 35: [prettier/prettier] Replace `·name:·'Novecientas·Aves',·description:·'Medalla·por·registrar·900·aves',·condition_type:·MedalConditionType.BIRD_COUNT,·condition_value:·900,·iconUrl:·'assets/imgs/medals/bird_900.png'` with `⏎····name:·'Novecientas·Aves',⏎····description:·'Medalla·por·registrar·900·aves',⏎····condition_type:·MedalConditionType.BIRD_COUNT,⏎····condition_value:·900,⏎····iconUrl:·'assets/imgs/medals/bird_900.png',⏎·`",
      "Línea 36: [prettier/prettier] Replace `·name:·'Mil·Aves',·description:·'Medalla·por·registrar·1000·aves',·condition_type:·MedalConditionType.BIRD_COUNT,·condition_value:·1000,·iconUrl:·'assets/imgs/medals/bird_1000.png'` with `⏎····name:·'Mil·Aves',⏎····description:·'Medalla·por·registrar·1000·aves',⏎····condition_type:·MedalConditionType.BIRD_COUNT,⏎····condition_value:·1000,⏎····iconUrl:·'assets/imgs/medals/bird_1000.png',⏎·`",
      "Línea 37: [prettier/prettier] Replace `·name:·'Mil·Quinientas·Aves',·description:·'Medalla·por·registrar·1500·aves',·condition_type:·MedalConditionType.BIRD_COUNT,·condition_value:·1500,·iconUrl:·'assets/imgs/medals/bird_1500.png'` with `⏎····name:·'Mil·Quinientas·Aves',⏎····description:·'Medalla·por·registrar·1500·aves',⏎····condition_type:·MedalConditionType.BIRD_COUNT,⏎····condition_value:·1500,⏎····iconUrl:·'assets/imgs/medals/bird_1500.png',⏎·`",
      "Línea 38: [prettier/prettier] Replace `·name:·'Veterano',·description:·'Medalla·por·estar·365·días·en·la·aplicación',·condition_type:·MedalConditionType.DAYS_ACTIVE,·condition_value:·365,·iconUrl:·'assets/imgs/medals/days_365.png'` with `⏎····name:·'Veterano',⏎····description:·'Medalla·por·estar·365·días·en·la·aplicación',⏎····condition_type:·MedalConditionType.DAYS_ACTIVE,⏎····condition_value:·365,⏎····iconUrl:·'assets/imgs/medals/days_365.png',⏎·`",
      "Línea 45: [prettier/prettier] Delete `····`",
      "Línea 50: [prettier/prettier] Delete `····`",
      "Línea 59: [prettier/prettier] Delete `····`",
      "Línea 71: [@typescript-eslint/no-floating-promises] Promises must be awaited, end with a call to .catch, end with a call to .then with a rejection handler or be explicitly marked as ignored with the `void` operator."
    ]
  }
]
```

**OUTPUT ESPERADO:**
Ejecuta la refactorización para estos archivos y entrégame los bloques de código corregidos.