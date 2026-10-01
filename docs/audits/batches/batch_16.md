# [SYSTEM OVERRIDE: ATOMIC REFACTORING MODE - BATCH 16]

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
    "file": "frontend/src/app/pages/birds/bird-search/components/categorical-filter/categorical-filter.component.ts",
    "errors": [
      "Línea 9: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 10: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 11: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 12: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 13: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 14: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 17: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 18: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 19: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 20: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 21: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 24: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 43: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 44: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 45: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 50: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 60: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 61: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 62: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 64: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 68: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 112: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 123: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 130: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 145: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 159: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 165: [jsdoc/require-jsdoc] Missing JSDoc comment."
    ]
  },
  {
    "file": "frontend/src/app/pages/birds/bird-search/components/general-filter/general-filter.component.ts",
    "errors": [
      "Línea 29: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 30: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 31: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 32: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 33: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 35: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 36: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 37: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 38: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 40: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 40: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 40: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 40: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 40: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 42: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 83: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 107: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 107: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 107: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 107: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 114: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 137: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 146: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 146: [jsdoc/require-returns] Missing JSDoc @returns declaration.",
      "Línea 156: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 156: [jsdoc/require-returns] Missing JSDoc @returns declaration.",
      "Línea 166: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 181: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line."
    ]
  },
  {
    "file": "frontend/src/app/pages/birds/bird-search/components/search-map/search-map.component.ts",
    "errors": [
      "Línea 31: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 39: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 41: [@typescript-eslint/no-unused-vars] 'data' is assigned a value but never used.",
      "Línea 47: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 48: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 50: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 52: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 61: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 67: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 95: [jsdoc/require-jsdoc] Missing JSDoc comment."
    ]
  },
  {
    "file": "frontend/src/app/pages/birds/components/bird-encyclopedia-view/bird-encyclopedia-view.component.ts",
    "errors": [
      "Línea 98: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 99: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 101: [jsdoc/require-jsdoc] Missing JSDoc comment."
    ]
  }
]
```

**OUTPUT ESPERADO:**
Ejecuta la refactorización para estos archivos y entrégame los bloques de código corregidos.