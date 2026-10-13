# [SYSTEM OVERRIDE: ATOMIC REFACTORING MODE - BATCH 6]

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
    "file": "frontend/src/app/pages/birds/bird-search/components/general-filter/general-filter.component.ts",
    "errors": [
      "Línea 95: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 99: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 103: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 151: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 180: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 184: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 188: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 197: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 220: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 229: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 229: [jsdoc/require-returns] Missing JSDoc @returns declaration.",
      "Línea 239: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 239: [jsdoc/require-returns] Missing JSDoc @returns declaration.",
      "Línea 249: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 264: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line."
    ]
  },
  {
    "file": "frontend/src/app/pages/business-profile/business-profile.page.ts",
    "errors": [
      "Línea 40: [@typescript-eslint/no-unused-vars] 'CalendarDay' is defined but never used."
    ]
  },
  {
    "file": "frontend/src/app/pages/business-profile/components/business-form-tab/business-form-tab.component.ts",
    "errors": [
      "Línea 45: [jsdoc/require-jsdoc] Missing JSDoc comment."
    ]
  },
  {
    "file": "frontend/src/app/pages/dashboard/components/feed-pajarero/components/sighting-card/sighting-card.component.spec.ts",
    "errors": [
      "Línea 5: [@typescript-eslint/no-unused-vars] '_component' is assigned a value but never used."
    ]
  }
]
```

**OUTPUT ESPERADO:**
Ejecuta la refactorización para estos archivos y entrégame los bloques de código corregidos.