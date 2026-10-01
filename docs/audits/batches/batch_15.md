# [SYSTEM OVERRIDE: ATOMIC REFACTORING MODE - BATCH 15]

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
    "file": "frontend/src/app/core/stores/sightings-map.store.ts",
    "errors": [
      "Línea 15: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 16: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 17: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 29: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 29: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 29: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 45: [@typescript-eslint/no-unused-vars] 'err' is defined but never used."
    ]
  },
  {
    "file": "frontend/src/app/core/stores/site.store.ts",
    "errors": [
      "Línea 11: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 12: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 13: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 28: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 49: [jsdoc/require-jsdoc] Missing JSDoc comment."
    ]
  },
  {
    "file": "frontend/src/app/core/stores/sync-queue.store.ts",
    "errors": [
      "Línea 12: [@typescript-eslint/no-unused-vars] 'ISyncCatalogsResponse' is defined but never used.",
      "Línea 14: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 15: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 16: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 17: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 36: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 49: [sonarjs/cognitive-complexity] Refactor this function to reduce its Cognitive Complexity from 75 to the 15 allowed.",
      "Línea 49: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 86: [@typescript-eslint/no-explicit-any] Unexpected any. Specify a different type.",
      "Línea 88: [@typescript-eslint/no-explicit-any] Unexpected any. Specify a different type."
    ]
  },
  {
    "file": "frontend/src/app/pages/birds/bird-search/bird-search.page.ts",
    "errors": [
      "Línea 33: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 34: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 35: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 36: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 41: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 51: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 62: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 72: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 97: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 97: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 104: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 104: [jsdoc/require-returns] Missing JSDoc @returns declaration.",
      "Línea 116: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 116: [jsdoc/require-returns] Missing JSDoc @returns declaration.",
      "Línea 136: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 171: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 171: [jsdoc/require-param] Missing JSDoc @param \"index\" declaration.",
      "Línea 171: [jsdoc/require-param] Missing JSDoc @param \"item\" declaration.",
      "Línea 171: [jsdoc/require-returns] Missing JSDoc @returns declaration."
    ]
  }
]
```

**OUTPUT ESPERADO:**
Ejecuta la refactorización para estos archivos y entrégame los bloques de código corregidos.