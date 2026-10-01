# [SYSTEM OVERRIDE: ATOMIC REFACTORING MODE - BATCH 21]

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
    "file": "frontend/src/app/pages/routes/route-workspace/components/map-tracker/map-tracker.component.ts",
    "errors": [
      "Línea 26: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 27: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 28: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 30: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 31: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 32: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 33: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 35: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 36: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 38: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 42: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 90: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 90: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 111: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 127: [jsdoc/require-jsdoc] Missing JSDoc comment."
    ]
  },
  {
    "file": "frontend/src/app/pages/routes/route-workspace/components/sighting-logger/sighting-logger.component.ts",
    "errors": [
      "Línea 5: [@typescript-eslint/no-unused-vars] 'signal' is defined but never used.",
      "Línea 20: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 21: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 23: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 24: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 24: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 29: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 29: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 29: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 29: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 31: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 33: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 34: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 35: [@typescript-eslint/no-explicit-any] Unexpected any. Specify a different type.",
      "Línea 38: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 43: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 55: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 55: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 55: [jsdoc/require-jsdoc] Missing JSDoc comment."
    ]
  },
  {
    "file": "frontend/src/app/pages/routes/route-workspace/route-workspace.page.ts",
    "errors": [
      "Línea 15: [@typescript-eslint/no-unused-vars] 'GeoLocation' is defined but never used.",
      "Línea 31: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 32: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 34: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 35: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 36: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 37: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 38: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 39: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 40: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 42: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 43: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 44: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 45: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 46: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 47: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 48: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 49: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 50: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 53: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 54: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 55: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 56: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 57: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 64: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 68: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 116: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 123: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 163: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 170: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 245: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 264: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 264: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 264: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 264: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 269: [jsdoc/require-jsdoc] Missing JSDoc comment."
    ]
  },
  {
    "file": "frontend/src/app/pages/routes/routes-landing/routes-landing.page.ts",
    "errors": [
      "Línea 15: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 16: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 17: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 18: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 19: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 20: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 21: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 31: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 32: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 33: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 35: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 36: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 37: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 39: [jsdoc/require-jsdoc] Missing JSDoc comment."
    ]
  }
]
```

**OUTPUT ESPERADO:**
Ejecuta la refactorización para estos archivos y entrégame los bloques de código corregidos.