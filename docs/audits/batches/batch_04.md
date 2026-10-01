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
    "file": "backend/src/infrastructure/entities/family.entity.ts",
    "errors": [
      "Línea 38: [prettier/prettier] Delete `⏎`"
    ]
  },
  {
    "file": "backend/src/infrastructure/entities/feeding-type.entity.ts",
    "errors": [
      "Línea 26: [prettier/prettier] Delete `⏎`"
    ]
  },
  {
    "file": "backend/src/infrastructure/entities/guide.entity.ts",
    "errors": [
      "Línea 46: [prettier/prettier] Delete `⏎`"
    ]
  },
  {
    "file": "backend/src/infrastructure/entities/habitat.entity.ts",
    "errors": [
      "Línea 30: [prettier/prettier] Delete `⏎`"
    ]
  }
]
```

**OUTPUT ESPERADO:**
Ejecuta la refactorización para estos archivos y entrégame los bloques de código corregidos.