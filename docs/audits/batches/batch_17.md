# [SYSTEM OVERRIDE: ATOMIC REFACTORING MODE - BATCH 17]

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
    "file": "frontend/src/app/pages/birds/sightings-map/sightings-map.page.ts",
    "errors": [
      "Línea 1: [@typescript-eslint/no-unused-vars] 'WritableSignal' is defined but never used.",
      "Línea 2: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 3: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 4: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 5: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 6: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 7: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 7: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 7: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 8: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 8: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 8: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 27: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 28: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 29: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 30: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 31: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 33: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 34: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 36: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 37: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 38: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 41: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 42: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 43: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 54: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 56: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 69: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 75: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 83: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 87: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 91: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 92: [jsdoc/require-jsdoc] Missing JSDoc comment."
    ]
  },
  {
    "file": "frontend/src/app/pages/dashboard/components/feed-pajarero/components/create-feed-post/create-feed-post.component.ts",
    "errors": [
      "Línea 4: [@typescript-eslint/no-unused-vars] 'addIcons' is defined but never used.",
      "Línea 123: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 124: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 126: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 128: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 129: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 130: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 130: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 130: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 131: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 133: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 135: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 139: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 143: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 143: [@typescript-eslint/no-explicit-any] Unexpected any. Specify a different type.",
      "Línea 147: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 163: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 176: [jsdoc/require-jsdoc] Missing JSDoc comment."
    ]
  },
  {
    "file": "frontend/src/app/pages/dashboard/components/feed-pajarero/components/post-replies/post-replies.component.ts",
    "errors": [
      "Línea 96: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 97: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 99: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 105: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 106: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 107: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 109: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 110: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 111: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 112: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 114: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 118: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 121: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 125: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 132: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 156: [jsdoc/require-jsdoc] Missing JSDoc comment."
    ]
  },
  {
    "file": "frontend/src/app/pages/dashboard/components/feed-pajarero/components/sighting-card/sighting-card.component.spec.ts",
    "errors": [
      "Línea 6: [@typescript-eslint/no-unused-vars] 'component' is assigned a value but never used."
    ]
  }
]
```

**OUTPUT ESPERADO:**
Ejecuta la refactorización para estos archivos y entrégame los bloques de código corregidos.