# [SYSTEM OVERRIDE: ATOMIC REFACTORING MODE - BATCH 2]

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
    "file": "backend/src/infrastructure/controllers/feed.controller.ts",
    "errors": [
      "Línea 106: [@typescript-eslint/no-unsafe-argument] Unsafe argument of type `any` assigned to a parameter of type `string`."
    ]
  },
  {
    "file": "backend/src/infrastructure/entities/additional-info.entity.ts",
    "errors": [
      "Línea 26: [prettier/prettier] Delete `⏎`"
    ]
  },
  {
    "file": "backend/src/infrastructure/entities/beak-morphology.entity.ts",
    "errors": [
      "Línea 26: [prettier/prettier] Delete `⏎`"
    ]
  },
  {
    "file": "backend/src/infrastructure/entities/behavior-type.entity.ts",
    "errors": [
      "Línea 26: [prettier/prettier] Delete `⏎`"
    ]
  }
]
```

**OUTPUT ESPERADO:**
Ejecuta la refactorización para estos archivos y entrégame los bloques de código corregidos.