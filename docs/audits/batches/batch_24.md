# [SYSTEM OVERRIDE: ATOMIC REFACTORING MODE - BATCH 24]

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
    "file": "shared/models/catalogs.interface.ts",
    "errors": [
      "Línea 8: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 9: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 10: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 11: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 12: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 13: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 14: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 15: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 16: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 17: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 18: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 19: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 20: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 23: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 24: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 25: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 26: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 27: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 28: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 29: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 30: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 30: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 30: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 31: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 32: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 33: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 34: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 35: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 36: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 39: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 40: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 41: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 42: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 43: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 44: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 45: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 46: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 47: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 48: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 49: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 50: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 51: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 52: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 53: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 54: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 55: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 56: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 57: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 58: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 59: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 60: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 61: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 62: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 63: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 64: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 65: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 66: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 67: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 68: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 69: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 72: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 73: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 74: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 75: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 75: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 75: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 76: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 77: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 77: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 77: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 77: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 78: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 78: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 78: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 78: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 78: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 79: [jsdoc/require-jsdoc] Missing JSDoc comment."
    ]
  },
  {
    "file": "shared/models/feed.model.ts",
    "errors": [
      "Línea 8: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 9: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 10: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 11: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 12: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 13: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 14: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 15: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 15: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 15: [jsdoc/require-jsdoc] Missing JSDoc comment.",
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
      "Línea 32: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 33: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 34: [jsdoc/require-jsdoc] Missing JSDoc comment."
    ]
  },
  {
    "file": "shared/models/routes.interface.ts",
    "errors": [
      "Línea 8: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 9: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 10: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 11: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 12: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 13: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 14: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 15: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 16: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 17: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 20: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 21: [jsdoc/require-jsdoc] Missing JSDoc comment.",
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
      "Línea 34: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 35: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 39: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 40: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 41: [jsdoc/require-jsdoc] Missing JSDoc comment."
    ]
  },
  {
    "file": "frontend/src/global.scss",
    "errors": [
      "Línea 146: [no-descending-specificity] Expected selector \".native-input\" to come before selector \".native-input\" (\":is(.form-field .input-wrapper) .native-input\"), at line 97 (no-descending-specificity)",
      "Línea 216: [no-descending-specificity] Expected selector \".native-input\" to come before selector \".native-input\" (\":is(.form-field .input-wrapper) .native-input\"), at line 97 (no-descending-specificity)",
      "Línea 216: [no-duplicate-selectors] Duplicate selector \".native-input\", first used at line 146 (no-duplicate-selectors)"
    ]
  }
]
```

**OUTPUT ESPERADO:**
Ejecuta la refactorización para estos archivos y entrégame los bloques de código corregidos.