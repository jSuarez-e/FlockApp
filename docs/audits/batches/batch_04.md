# [SYSTEM OVERRIDE: ATOMIC REFACTORING MODE - BATCH 4]

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
    "file": "frontend/src/app/core/services/ui.service.ts",
    "errors": [
      "Línea 125: [jsdoc/require-returns] Missing JSDoc @returns declaration.",
      "Línea 134: [jsdoc/require-returns] Missing JSDoc @returns declaration."
    ]
  },
  {
    "file": "frontend/src/app/core/services/user.service.ts",
    "errors": [
      "Línea 34: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 51: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 81: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 126: [jsdoc/require-returns] Missing JSDoc @returns declaration.",
      "Línea 156: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line."
    ]
  },
  {
    "file": "frontend/src/app/core/stores/active-route.store.ts",
    "errors": [
      "Línea 131: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 131: [jsdoc/require-returns] Missing JSDoc @returns declaration.",
      "Línea 192: [jsdoc/require-returns] Missing JSDoc @returns declaration.",
      "Línea 430: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line."
    ]
  },
  {
    "file": "frontend/src/app/core/stores/auth.store.ts",
    "errors": [
      "Línea 43: [jsdoc/require-returns] Missing JSDoc @returns declaration.",
      "Línea 69: [jsdoc/require-returns] Missing JSDoc @returns declaration."
    ]
  }
]
```

**OUTPUT ESPERADO:**
Ejecuta la refactorización para estos archivos y entrégame los bloques de código corregidos.