# [SYSTEM OVERRIDE: ATOMIC REFACTORING MODE - BATCH 9]

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
  },
  {
    "file": "frontend/src/environments/environment.interface.ts",
    "errors": [
      "Línea 8: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 9: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 10: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 11: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 12: [jsdoc/require-jsdoc] Missing JSDoc comment."
    ]
  },
  {
    "file": "shared/models/bird.model.ts",
    "errors": [
      "Línea 25: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 25: [jsdoc/require-jsdoc] Missing JSDoc comment."
    ]
  }
]
```

**OUTPUT ESPERADO:**
Ejecuta la refactorización para estos archivos y entrégame los bloques de código corregidos.