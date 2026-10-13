# [SYSTEM OVERRIDE: ATOMIC REFACTORING MODE - BATCH 8]

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
      "Línea 73: [jsdoc/require-description] Missing JSDoc block description.",
      "Línea 134: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 161: [jsdoc/require-description] Missing JSDoc block description.",
      "Línea 181: [jsdoc/require-description] Missing JSDoc block description."
    ]
  },
  {
    "file": "frontend/src/app/pages/settings/settings.page.ts",
    "errors": [
      "Línea 60: [jsdoc/require-jsdoc] Missing JSDoc comment."
    ]
  },
  {
    "file": "frontend/src/app/shared/components/permission-rationale-modal/permission-rationale-modal.component.ts",
    "errors": [
      "Línea 29: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 48: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 49: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 51: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 53: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 64: [jsdoc/require-returns] Missing JSDoc @returns declaration.",
      "Línea 68: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 69: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 70: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 71: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 72: [jsdoc/require-jsdoc] Missing JSDoc comment."
    ]
  },
  {
    "file": "frontend/src/app/shared/components/section-header/section-header.component.ts",
    "errors": [
      "Línea 75: [jsdoc/require-jsdoc] Missing JSDoc comment."
    ]
  }
]
```

**OUTPUT ESPERADO:**
Ejecuta la refactorización para estos archivos y entrégame los bloques de código corregidos.