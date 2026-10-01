# [SYSTEM OVERRIDE: ATOMIC REFACTORING MODE - BATCH 13]

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
    "file": "frontend/src/app/core/services/user.service.ts",
    "errors": [
      "Línea 17: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 18: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 19: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 20: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 22: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 39: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 69: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 81: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 87: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 91: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 91: [jsdoc/require-param] Missing JSDoc @param \"data.oldPassword\" declaration.",
      "Línea 91: [jsdoc/require-param] Missing JSDoc @param \"data.newPassword\" declaration.",
      "Línea 91: [jsdoc/require-returns] Missing JSDoc @returns declaration.",
      "Línea 96: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 96: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 96: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 98: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 105: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line."
    ]
  },
  {
    "file": "frontend/src/app/core/stores/active-route.store.ts",
    "errors": [
      "Línea 11: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 12: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 13: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 14: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 15: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 16: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 16: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 17: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 18: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 19: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 22: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 23: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 24: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 25: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 26: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 27: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 28: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 29: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 30: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 31: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 32: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 46: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 46: [jsdoc/require-param] Missing JSDoc @param \"coord1\" declaration.",
      "Línea 46: [jsdoc/require-param] Missing JSDoc @param \"coord2\" declaration.",
      "Línea 46: [jsdoc/require-returns] Missing JSDoc @returns declaration.",
      "Línea 73: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 95: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 105: [@typescript-eslint/no-unused-vars] 'e' is defined but never used.",
      "Línea 120: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 132: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 132: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 132: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 132: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 132: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 132: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 132: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 181: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 181: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 181: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 200: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 200: [jsdoc/require-param] Missing JSDoc @param \"birdId\" declaration.",
      "Línea 200: [jsdoc/require-param] Missing JSDoc @param \"quantity\" declaration.",
      "Línea 200: [jsdoc/require-param] Missing JSDoc @param \"details\" declaration.",
      "Línea 200: [jsdoc/require-param] Missing JSDoc @param \"birdInfo\" declaration.",
      "Línea 211: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 264: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 273: [jsdoc/require-jsdoc] Missing JSDoc comment."
    ]
  },
  {
    "file": "frontend/src/app/core/stores/auth.store.ts",
    "errors": [
      "Línea 6: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 7: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 8: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 9: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 27: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 43: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 55: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 61: [jsdoc/require-jsdoc] Missing JSDoc comment."
    ]
  },
  {
    "file": "frontend/src/app/core/stores/bird-search.store.ts",
    "errors": [
      "Línea 13: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 14: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 15: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 18: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 19: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 19: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 20: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 20: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 22: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 23: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 24: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 25: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 189: [@typescript-eslint/no-unused-vars] 'network' is assigned a value but never used.",
      "Línea 190: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 196: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 202: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 215: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 243: [jsdoc/require-jsdoc] Missing JSDoc comment."
    ]
  }
]
```

**OUTPUT ESPERADO:**
Ejecuta la refactorización para estos archivos y entrégame los bloques de código corregidos.