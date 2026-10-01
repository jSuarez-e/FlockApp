# [SYSTEM OVERRIDE: ATOMIC REFACTORING MODE - BATCH 18]

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
    "file": "frontend/src/app/pages/dashboard/components/feed-pajarero/components/sighting-card/sighting-card.component.ts",
    "errors": [
      "Línea 27: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 28: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 30: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 41: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 42: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 43: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 45: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 48: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 51: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 55: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 61: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 66: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 66: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 66: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 70: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 70: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 70: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 77: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 82: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 95: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 102: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 114: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 122: [jsdoc/require-jsdoc] Missing JSDoc comment."
    ]
  },
  {
    "file": "frontend/src/app/pages/dashboard/components/feed-pajarero/feed-pajarero.component.ts",
    "errors": [
      "Línea 30: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 31: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 33: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 37: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 41: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 44: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 49: [jsdoc/require-jsdoc] Missing JSDoc comment."
    ]
  },
  {
    "file": "frontend/src/app/pages/dashboard/components/role-selector/role-selector.component.ts",
    "errors": [
      "Línea 7: [@typescript-eslint/no-unused-vars] 'DashboardView' is defined but never used.",
      "Línea 101: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 103: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line."
    ]
  },
  {
    "file": "frontend/src/app/pages/dashboard/dashboard.page.spec.ts",
    "errors": [
      "Línea 25: [@typescript-eslint/no-explicit-any] Unexpected any. Specify a different type."
    ]
  }
]
```

**OUTPUT ESPERADO:**
Ejecuta la refactorización para estos archivos y entrégame los bloques de código corregidos.