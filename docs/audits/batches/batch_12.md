# [SYSTEM OVERRIDE: ATOMIC REFACTORING MODE - BATCH 12]

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
    "file": "frontend/src/app/core/services/guide.service.ts",
    "errors": [
      "Línea 14: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 15: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 17: [jsdoc/require-jsdoc] Missing JSDoc comment."
    ]
  },
  {
    "file": "frontend/src/app/core/services/sightings.service.ts",
    "errors": [
      "Línea 45: [jsdoc/require-param] Missing JSDoc @param \"departmentId\" declaration.",
      "Línea 56: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 94: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 94: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 94: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 94: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 94: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 94: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 94: [jsdoc/require-jsdoc] Missing JSDoc comment."
    ]
  },
  {
    "file": "frontend/src/app/core/services/sync.service.ts",
    "errors": [
      "Línea 14: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 15: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 17: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 17: [@typescript-eslint/no-explicit-any] Unexpected any. Specify a different type.",
      "Línea 17: [@typescript-eslint/no-explicit-any] Unexpected any. Specify a different type.",
      "Línea 21: [jsdoc/require-jsdoc] Missing JSDoc comment."
    ]
  },
  {
    "file": "frontend/src/app/core/services/ui.service.ts",
    "errors": [
      "Línea 16: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 17: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 18: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 23: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 25: [jsdoc/require-param] Missing JSDoc @param \"message\" declaration.",
      "Línea 25: [jsdoc/require-param] Missing JSDoc @param \"color\" declaration.",
      "Línea 25: [jsdoc/require-param] Missing JSDoc @param \"position\" declaration.",
      "Línea 47: [jsdoc/require-param] Missing JSDoc @param \"message\" declaration.",
      "Línea 63: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 71: [jsdoc/require-param] Missing JSDoc @param \"header\" declaration.",
      "Línea 71: [jsdoc/require-param] Missing JSDoc @param \"message\" declaration.",
      "Línea 86: [jsdoc/require-param] Missing JSDoc @param \"header\" declaration.",
      "Línea 86: [jsdoc/require-param] Missing JSDoc @param \"message\" declaration.",
      "Línea 102: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 108: [jsdoc/require-jsdoc] Missing JSDoc comment."
    ]
  }
]
```

**OUTPUT ESPERADO:**
Ejecuta la refactorización para estos archivos y entrégame los bloques de código corregidos.