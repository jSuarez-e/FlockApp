# [SYSTEM OVERRIDE: ATOMIC REFACTORING MODE - BATCH 25]

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
    "file": "frontend/src/app/app.component.scss",
    "errors": [
      "Línea 1: [no-empty-source] Empty source (no-empty-source)"
    ]
  },
  {
    "file": "frontend/src/app/pages/main-layout/main-layout.page.scss",
    "errors": [
      "Línea 137: [no-descending-specificity] Expected selector \"ion-icon\" (\".logout-item ion-icon\") to come before selector \"ion-icon\" (\".menu-item.selected ion-icon\"), at line 124 (no-descending-specificity)",
      "Línea 155: [no-descending-specificity] Expected selector \"ion-icon\" (\":is(.ibirds-tab-bar ion-tab-button) ion-icon\") to come before selector \"ion-icon\" (\".menu-item.selected ion-icon\"), at line 124 (no-descending-specificity)"
    ]
  },
  {
    "file": "frontend/src/app/pages/profile/profile.page.scss",
    "errors": [
      "Línea 205: [no-descending-specificity] Expected selector \"ion-icon\" (\".input-wrapper ion-icon\") to come before selector \"ion-icon\" (\":is(.card-header-immersive .btn-edit-cover) ion-icon\"), at line 39 (no-descending-specificity)"
    ]
  },
  {
    "file": "frontend/src/app/pages/birds/bird-search/bird-search.page.scss",
    "errors": [
      "Línea 195: [no-descending-specificity] Expected selector \"ion-icon\" (\":is(.centered-empty-container .icon-shape-badge) ion-icon\") to come before selector \"ion-icon\" (\":is(:is(.active-chips-scroll .chips-wrapper) ion-chip) ion-icon\"), at line 67 (no-descending-specificity)"
    ]
  }
]
```

**OUTPUT ESPERADO:**
Ejecuta la refactorización para estos archivos y entrégame los bloques de código corregidos.