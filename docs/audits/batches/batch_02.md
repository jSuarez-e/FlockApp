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
    "file": "frontend/src/app/core/services/app-permissions.service.ts",
    "errors": [
      "Línea 181: [jsdoc/require-jsdoc] Missing JSDoc comment."
    ]
  },
  {
    "file": "frontend/src/app/core/services/auth.service.ts",
    "errors": [
      "Línea 40: [jsdoc/require-description] Missing JSDoc block description.",
      "Línea 49: [jsdoc/require-description] Missing JSDoc block description.",
      "Línea 59: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 75: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 107: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 113: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 115: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 121: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 131: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 133: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 140: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 152: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 155: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 163: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line."
    ]
  },
  {
    "file": "frontend/src/app/core/services/bird-seeder.service.ts",
    "errors": [
      "Línea 20: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 21: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 22: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 23: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 25: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 56: [jsdoc/require-jsdoc] Missing JSDoc comment."
    ]
  },
  {
    "file": "frontend/src/app/core/services/crypto.service.ts",
    "errors": [
      "Línea 20: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 21: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 22: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 24: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 35: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 45: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 58: [@typescript-eslint/no-unused-vars] '_error' is defined but never used."
    ]
  }
]
```

**OUTPUT ESPERADO:**
Ejecuta la refactorización para estos archivos y entrégame los bloques de código corregidos.