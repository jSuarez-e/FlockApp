# [SYSTEM OVERRIDE: ATOMIC REFACTORING MODE - BATCH 7]

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
    "file": "frontend/src/app/pages/dashboard/components/feed-pajarero/feed-pajarero.component.ts",
    "errors": [
      "Línea 56: [jsdoc/require-description] Missing JSDoc block description.",
      "Línea 63: [jsdoc/require-description] Missing JSDoc block description.",
      "Línea 89: [jsdoc/require-description] Missing JSDoc block description.",
      "Línea 106: [jsdoc/require-description] Missing JSDoc block description."
    ]
  },
  {
    "file": "frontend/src/app/pages/dashboard/dashboard.page.ts",
    "errors": [
      "Línea 69: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 82: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 91: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line."
    ]
  },
  {
    "file": "frontend/src/app/pages/profile/profile.page.ts",
    "errors": [
      "Línea 92: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 93: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 94: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 95: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 96: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 97: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 98: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 99: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 103: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 105: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 106: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 107: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 108: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 109: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 110: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 111: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 113: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 136: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 208: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 209: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 210: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 211: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 218: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 223: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 347: [jsdoc/require-description] Remove the @description tag to leave a plain block description or add additional description text above the @description line.",
      "Línea 347: [jsdoc/require-returns] Missing JSDoc @returns declaration.",
      "Línea 414: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 425: [jsdoc/require-jsdoc] Missing JSDoc comment."
    ]
  },
  {
    "file": "frontend/src/app/pages/routes/route-workspace/components/map-tracker/map-tracker.component.ts",
    "errors": [
      "Línea 81: [jsdoc/require-description] Missing JSDoc block description.",
      "Línea 142: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 169: [jsdoc/require-description] Missing JSDoc block description.",
      "Línea 189: [jsdoc/require-description] Missing JSDoc block description."
    ]
  }
]
```

**OUTPUT ESPERADO:**
Ejecuta la refactorización para estos archivos y entrégame los bloques de código corregidos.