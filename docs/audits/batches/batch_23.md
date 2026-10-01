# [SYSTEM OVERRIDE: ATOMIC REFACTORING MODE - BATCH 23]

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
    "file": "frontend/src/app/shared/components/otp-input/otp-input.component.ts",
    "errors": [
      "Línea 94: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 96: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 113: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 130: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 146: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line."
    ]
  },
  {
    "file": "frontend/src/app/shared/components/password-input/password-input.component.ts",
    "errors": [
      "Línea 20: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 21: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 22: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 23: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 24: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 26: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 28: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 29: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 31: [jsdoc/require-jsdoc] Missing JSDoc comment."
    ]
  },
  {
    "file": "frontend/src/zone-flags.ts",
    "errors": [
      "Línea 5: [unknown-rule] Unused eslint-disable directive (no problems were reported from 'no-underscore-dangle').",
      "Línea 6: [@typescript-eslint/no-explicit-any] Unexpected any. Specify a different type."
    ]
  },
  {
    "file": "shared/models/bird.model.ts",
    "errors": [
      "Línea 8: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 9: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 10: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 11: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 12: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 13: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 14: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 15: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 16: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 16: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 16: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 17: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 18: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 19: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 20: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 21: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 22: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 23: [jsdoc/require-jsdoc] Missing JSDoc comment."
    ]
  }
]
```

**OUTPUT ESPERADO:**
Ejecuta la refactorización para estos archivos y entrégame los bloques de código corregidos.