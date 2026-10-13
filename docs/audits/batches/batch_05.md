# [SYSTEM OVERRIDE: ATOMIC REFACTORING MODE - BATCH 5]

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
    "file": "frontend/src/app/core/stores/profile.store.ts",
    "errors": [
      "Línea 106: [jsdoc/require-description] Missing JSDoc block description.",
      "Línea 106: [jsdoc/require-returns] Missing JSDoc @returns declaration.",
      "Línea 136: [jsdoc/require-description] Missing JSDoc block description.",
      "Línea 136: [jsdoc/require-returns] Missing JSDoc @returns declaration.",
      "Línea 167: [jsdoc/require-description] Missing JSDoc block description.",
      "Línea 167: [jsdoc/require-returns] Missing JSDoc @returns declaration.",
      "Línea 182: [jsdoc/require-description] Missing JSDoc block description.",
      "Línea 194: [jsdoc/require-description] Missing JSDoc block description."
    ]
  },
  {
    "file": "frontend/src/app/core/stores/sync-queue.store.ts",
    "errors": [
      "Línea 71: [sonarjs/cognitive-complexity] Refactor this function to reduce its Cognitive Complexity from 109 to the 15 allowed."
    ]
  },
  {
    "file": "frontend/src/app/pages/birds/bird-search/bird-search.page.ts",
    "errors": [
      "Línea 74: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 84: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 95: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 105: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 130: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 134: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 134: [jsdoc/require-returns] Missing JSDoc @returns declaration.",
      "Línea 146: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 146: [jsdoc/require-returns] Missing JSDoc @returns declaration.",
      "Línea 166: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 179: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 179: [jsdoc/require-returns] Missing JSDoc @returns declaration."
    ]
  },
  {
    "file": "frontend/src/app/pages/birds/bird-search/components/categorical-filter/categorical-filter.component.ts",
    "errors": [
      "Línea 155: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 197: [jsdoc/require-description] Missing JSDoc block description.",
      "Línea 212: [jsdoc/require-description] Missing JSDoc block description.",
      "Línea 223: [jsdoc/require-description] Missing JSDoc block description.",
      "Línea 242: [jsdoc/require-description] Missing JSDoc block description.",
      "Línea 242: [jsdoc/require-returns] Missing JSDoc @returns declaration.",
      "Línea 260: [jsdoc/require-description] Missing JSDoc block description.",
      "Línea 269: [jsdoc/require-description] Missing JSDoc block description."
    ]
  }
]
```

**OUTPUT ESPERADO:**
Ejecuta la refactorización para estos archivos y entrégame los bloques de código corregidos.