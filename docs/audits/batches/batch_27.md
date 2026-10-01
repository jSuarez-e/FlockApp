# [SYSTEM OVERRIDE: ATOMIC REFACTORING MODE - BATCH 27]

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
    "file": "frontend/src/app/pages/profile/components/user-medals/user-medals.component.scss",
    "errors": [
      "Línea 49: [declaration-block-single-line-max-declarations] Too many declarations, maximum 1 (declaration-block-single-line-max-declarations)",
      "Línea 50: [declaration-block-single-line-max-declarations] Too many declarations, maximum 1 (declaration-block-single-line-max-declarations)",
      "Línea 51: [declaration-block-single-line-max-declarations] Too many declarations, maximum 1 (declaration-block-single-line-max-declarations)",
      "Línea 52: [declaration-block-single-line-max-declarations] Too many declarations, maximum 1 (declaration-block-single-line-max-declarations)",
      "Línea 53: [declaration-block-single-line-max-declarations] Too many declarations, maximum 1 (declaration-block-single-line-max-declarations)"
    ]
  },
  {
    "file": "frontend/src/app/pages/birds/bird-search/components/general-filter/general-filter.component.scss",
    "errors": [
      "Línea 91: [no-descending-specificity] Expected selector \".chip-title\" to come before selector \".chip-title\" (\".status-chip.active .chip-title\"), at line 62 (no-descending-specificity)"
    ]
  },
  {
    "file": "frontend/src/app/pages/routes/route-workspace/components/map-tracker/map-tracker.component.scss",
    "errors": [
      "Línea 67: [declaration-block-single-line-max-declarations] Too many declarations, maximum 1 (declaration-block-single-line-max-declarations)",
      "Línea 68: [declaration-block-single-line-max-declarations] Too many declarations, maximum 1 (declaration-block-single-line-max-declarations)",
      "Línea 45: [selector-pseudo-element-no-unknown] Unknown pseudo-element selector \"::ng-deep\" (selector-pseudo-element-no-unknown)",
      "Línea 71: [selector-pseudo-element-no-unknown] Unknown pseudo-element selector \"::ng-deep\" (selector-pseudo-element-no-unknown)"
    ]
  },
  {
    "file": "frontend/src/app/pages/routes/route-workspace/components/sighting-logger/sighting-logger.component.scss",
    "errors": [
      "Línea 84: [no-descending-specificity] Expected selector \"p\" (\":is(:is(.logger-container .logged-list) ion-item) p\") to come before selector \"p\" (\":is(:is(.logger-container .stats-container) .stat-box) p\"), at line 58 (no-descending-specificity)"
    ]
  }
]
```

**OUTPUT ESPERADO:**
Ejecuta la refactorización para estos archivos y entrégame los bloques de código corregidos.