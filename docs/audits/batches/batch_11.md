# [SYSTEM OVERRIDE: ATOMIC REFACTORING MODE - BATCH 11]

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
    "file": "frontend/src/app/core/services/crypto.service.ts",
    "errors": [
      "Línea 15: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 16: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 17: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 19: [jsdoc/require-returns] Missing JSDoc @returns declaration.",
      "Línea 28: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 50: [@typescript-eslint/no-unused-vars] 'error' is defined but never used."
    ]
  },
  {
    "file": "frontend/src/app/core/services/db-helper.service.ts",
    "errors": [
      "Línea 16: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 17: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 31: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 34: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 42: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 44: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 60: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 65: [sonarjs/cognitive-complexity] Refactor this function to reduce its Cognitive Complexity from 21 to the 15 allowed.",
      "Línea 101: [@typescript-eslint/no-unused-vars] 'e' is defined but never used.",
      "Línea 106: [@typescript-eslint/no-unused-vars] 'e' is defined but never used.",
      "Línea 109: [@typescript-eslint/no-unused-vars] 'e' is defined but never used.",
      "Línea 135: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 150: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 160: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 170: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 181: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 190: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 198: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 198: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 211: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 223: [@typescript-eslint/no-unused-vars] 'e' is defined but never used.",
      "Línea 229: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 229: [jsdoc/require-param] Missing JSDoc @param \"sql\" declaration.",
      "Línea 239: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 239: [jsdoc/require-param] Missing JSDoc @param \"sql\" declaration.",
      "Línea 239: [jsdoc/require-param] Missing JSDoc @param \"params\" declaration.",
      "Línea 258: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 269: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 274: [sonarjs/cognitive-complexity] Refactor this function to reduce its Cognitive Complexity from 17 to the 15 allowed.",
      "Línea 305: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 324: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 325: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 337: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 337: [sonarjs/cognitive-complexity] Refactor this function to reduce its Cognitive Complexity from 16 to the 15 allowed.",
      "Línea 369: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 379: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 391: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 409: [jsdoc/require-jsdoc] Missing JSDoc comment."
    ]
  },
  {
    "file": "frontend/src/app/core/services/feed.service.ts",
    "errors": [
      "Línea 10: [@typescript-eslint/no-unused-vars] 'FeedPost' is defined but never used.",
      "Línea 14: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 15: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 17: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 17: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 17: [@typescript-eslint/no-explicit-any] Unexpected any. Specify a different type.",
      "Línea 17: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 21: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 21: [@typescript-eslint/no-explicit-any] Unexpected any. Specify a different type.",
      "Línea 21: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 24: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 24: [@typescript-eslint/no-explicit-any] Unexpected any. Specify a different type.",
      "Línea 25: [@typescript-eslint/no-explicit-any] Unexpected any. Specify a different type.",
      "Línea 28: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 28: [@typescript-eslint/no-explicit-any] Unexpected any. Specify a different type.",
      "Línea 32: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 32: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 32: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 33: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 33: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 36: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 36: [@typescript-eslint/no-explicit-any] Unexpected any. Specify a different type.",
      "Línea 37: [@typescript-eslint/no-explicit-any] Unexpected any. Specify a different type."
    ]
  },
  {
    "file": "frontend/src/app/core/services/geography.service.ts",
    "errors": [
      "Línea 3: [@typescript-eslint/no-unused-vars] 'firstValueFrom' is defined but never used.",
      "Línea 12: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 13: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 33: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 50: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line."
    ]
  }
]
```

**OUTPUT ESPERADO:**
Ejecuta la refactorización para estos archivos y entrégame los bloques de código corregidos.