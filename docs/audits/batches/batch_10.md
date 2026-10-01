# [SYSTEM OVERRIDE: ATOMIC REFACTORING MODE - BATCH 10]

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
    "file": "frontend/src/app/core/models/dashboard.interface.ts",
    "errors": [
      "Línea 12: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 13: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 14: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 15: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 16: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 17: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 18: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 19: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 20: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 21: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 22: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 23: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 24: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 25: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 32: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 33: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 34: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 35: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 36: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 37: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 38: [jsdoc/require-jsdoc] Missing JSDoc comment."
    ]
  },
  {
    "file": "frontend/src/app/core/models/sighting.models.ts",
    "errors": [
      "Línea 13: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 14: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 15: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 16: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 17: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 18: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 19: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 20: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 23: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 24: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 25: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 28: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 29: [jsdoc/require-jsdoc] Missing JSDoc comment."
    ]
  },
  {
    "file": "frontend/src/app/core/services/auth.service.ts",
    "errors": [
      "Línea 35: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 44: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 54: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 70: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 102: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 108: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 110: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 116: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 126: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 128: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 135: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 147: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 150: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 158: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line."
    ]
  },
  {
    "file": "frontend/src/app/core/services/bird-seeder.service.ts",
    "errors": [
      "Línea 4: [@typescript-eslint/no-unused-vars] 'JsonSQLite' is defined but never used.",
      "Línea 14: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 16: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 17: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 18: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 20: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 59: [jsdoc/require-jsdoc] Missing JSDoc comment."
    ]
  }
]
```

**OUTPUT ESPERADO:**
Ejecuta la refactorización para estos archivos y entrégame los bloques de código corregidos.