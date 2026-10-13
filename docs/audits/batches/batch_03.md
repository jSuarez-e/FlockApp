# [SYSTEM OVERRIDE: ATOMIC REFACTORING MODE - BATCH 3]

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
    "file": "frontend/src/app/core/services/db-helper.service.ts",
    "errors": [
      "Línea 17: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 18: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 32: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 33: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 41: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 43: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 63: [sonarjs/cognitive-complexity] Refactor this function to reduce its Cognitive Complexity from 55 to the 15 allowed.",
      "Línea 63: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 99: [@typescript-eslint/no-unused-vars] '_e' is defined but never used.",
      "Línea 104: [@typescript-eslint/no-unused-vars] '_e' is defined but never used.",
      "Línea 107: [@typescript-eslint/no-unused-vars] '_e' is defined but never used.",
      "Línea 110: [@typescript-eslint/no-unused-vars] '_e' is defined but never used.",
      "Línea 113: [@typescript-eslint/no-unused-vars] '_e' is defined but never used.",
      "Línea 187: [jsdoc/require-description] Missing JSDoc block description.",
      "Línea 202: [jsdoc/require-description] Missing JSDoc block description.",
      "Línea 216: [jsdoc/require-description] Missing JSDoc block description.",
      "Línea 226: [jsdoc/require-description] Missing JSDoc block description.",
      "Línea 235: [jsdoc/require-description] Missing JSDoc block description.",
      "Línea 244: [jsdoc/require-description] Missing JSDoc block description.",
      "Línea 252: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 252: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 265: [jsdoc/require-description] Missing JSDoc block description.",
      "Línea 277: [@typescript-eslint/no-unused-vars] '_e' is defined but never used.",
      "Línea 283: [jsdoc/require-description] Missing JSDoc block description.",
      "Línea 294: [jsdoc/require-description] Missing JSDoc block description.",
      "Línea 294: [jsdoc/require-param] Missing JSDoc @param \"sql\" declaration.",
      "Línea 294: [jsdoc/require-param] Missing JSDoc @param \"params\" declaration.",
      "Línea 313: [jsdoc/require-description] Missing JSDoc block description.",
      "Línea 330: [sonarjs/cognitive-complexity] Refactor this function to reduce its Cognitive Complexity from 17 to the 15 allowed.",
      "Línea 330: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 361: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 380: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 382: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 395: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 395: [sonarjs/cognitive-complexity] Refactor this function to reduce its Cognitive Complexity from 16 to the 15 allowed.",
      "Línea 427: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 437: [jsdoc/require-description] Missing JSDoc block description.",
      "Línea 452: [jsdoc/require-description] Missing JSDoc block description.",
      "Línea 472: [jsdoc/require-description] Missing JSDoc block description.",
      "Línea 485: [@typescript-eslint/no-unused-vars] '_e' is defined but never used."
    ]
  },
  {
    "file": "frontend/src/app/core/services/feed.service.ts",
    "errors": [
      "Línea 40: [jsdoc/require-returns] Missing JSDoc @returns declaration.",
      "Línea 69: [jsdoc/require-returns] Missing JSDoc @returns declaration.",
      "Línea 77: [jsdoc/require-returns] Missing JSDoc @returns declaration.",
      "Línea 81: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 82: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 91: [jsdoc/require-returns] Missing JSDoc @returns declaration.",
      "Línea 121: [jsdoc/require-returns] Missing JSDoc @returns declaration."
    ]
  },
  {
    "file": "frontend/src/app/core/services/sightings.service.ts",
    "errors": [
      "Línea 191: [jsdoc/require-returns] Missing JSDoc @returns declaration.",
      "Línea 240: [jsdoc/require-jsdoc] Missing JSDoc comment."
    ]
  },
  {
    "file": "frontend/src/app/core/services/sync.service.ts",
    "errors": [
      "Línea 26: [jsdoc/require-returns] Missing JSDoc @returns declaration.",
      "Línea 34: [jsdoc/require-returns] Missing JSDoc @returns declaration."
    ]
  }
]
```

**OUTPUT ESPERADO:**
Ejecuta la refactorización para estos archivos y entrégame los bloques de código corregidos.