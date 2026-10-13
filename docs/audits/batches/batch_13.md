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
    "file": "frontend/src/app/pages/business-profile/components/business-form-tab/business-form-tab.component.scss",
    "errors": [
      "Línea 134: [custom-property-empty-line-before] Expected empty line before custom property (custom-property-empty-line-before)",
      "Línea 157: [declaration-empty-line-before] Expected empty line before declaration (declaration-empty-line-before)",
      "Línea 107: [no-descending-specificity] Expected selector \"ion-icon\" (\".input-wrapper ion-icon\") to come before selector \"ion-icon\" (\":is(.directory-status-card .directory-status-info) ion-icon\"), at line 29 (no-descending-specificity)"
    ]
  },
  {
    "file": "frontend/src/app/pages/dashboard/components/feed-pajarero/feed-pajarero.component.scss",
    "errors": [
      "Línea 75: [alpha-value-notation] Expected \"0.45\" to be \"45%\" (alpha-value-notation)",
      "Línea 81: [alpha-value-notation] Expected \"0.55\" to be \"55%\" (alpha-value-notation)",
      "Línea 86: [alpha-value-notation] Expected \"0.3\" to be \"30%\" (alpha-value-notation)",
      "Línea 75: [color-function-alias-notation] Expected \"rgba\" to be \"rgb\" (color-function-alias-notation)",
      "Línea 81: [color-function-alias-notation] Expected \"rgba\" to be \"rgb\" (color-function-alias-notation)",
      "Línea 86: [color-function-alias-notation] Expected \"rgba\" to be \"rgb\" (color-function-alias-notation)",
      "Línea 75: [color-function-notation] Expected modern color-function notation (color-function-notation)",
      "Línea 81: [color-function-notation] Expected modern color-function notation (color-function-notation)",
      "Línea 86: [color-function-notation] Expected modern color-function notation (color-function-notation)",
      "Línea 86: [custom-property-empty-line-before] Expected empty line before custom property (custom-property-empty-line-before)",
      "Línea 76: [declaration-empty-line-before] Expected empty line before declaration (declaration-empty-line-before)"
    ]
  },
  {
    "file": "frontend/src/app/pages/dashboard/components/role-selector/role-selector.component.scss",
    "errors": [
      "Línea 88: [alpha-value-notation] Expected \"0.05\" to be \"5%\" (alpha-value-notation)",
      "Línea 101: [alpha-value-notation] Expected \"0.12\" to be \"12%\" (alpha-value-notation)",
      "Línea 101: [alpha-value-notation] Expected \"0.05\" to be \"5%\" (alpha-value-notation)",
      "Línea 133: [alpha-value-notation] Expected \"0.25\" to be \"25%\" (alpha-value-notation)",
      "Línea 137: [alpha-value-notation] Expected \"0.2\" to be \"20%\" (alpha-value-notation)",
      "Línea 88: [color-function-alias-notation] Expected \"rgba\" to be \"rgb\" (color-function-alias-notation)",
      "Línea 101: [color-function-alias-notation] Expected \"rgba\" to be \"rgb\" (color-function-alias-notation)",
      "Línea 101: [color-function-alias-notation] Expected \"rgba\" to be \"rgb\" (color-function-alias-notation)",
      "Línea 133: [color-function-alias-notation] Expected \"rgba\" to be \"rgb\" (color-function-alias-notation)",
      "Línea 137: [color-function-alias-notation] Expected \"rgba\" to be \"rgb\" (color-function-alias-notation)",
      "Línea 88: [color-function-notation] Expected modern color-function notation (color-function-notation)",
      "Línea 101: [color-function-notation] Expected modern color-function notation (color-function-notation)",
      "Línea 101: [color-function-notation] Expected modern color-function notation (color-function-notation)",
      "Línea 133: [color-function-notation] Expected modern color-function notation (color-function-notation)",
      "Línea 137: [color-function-notation] Expected modern color-function notation (color-function-notation)",
      "Línea 199: [no-descending-specificity] Expected selector \".role-card__arrow-btn\" to come before selector \".role-card__arrow-btn\" (\":is(.role-card:hover,.role-card:focus-visible) .role-card__arrow-btn\"), at line 104 (no-descending-specificity)",
      "Línea 271: [no-descending-specificity] Expected selector \".role-card__footer-icon\" to come before selector \".role-card__footer-icon\" (\":is(.role-card:hover,.role-card:focus-visible) .role-card__footer-icon\"), at line 110 (no-descending-specificity)",
      "Línea 61: [property-no-vendor-prefix] Vendor-prefixed property \"-webkit-background-clip\" (property-no-vendor-prefix)"
    ]
  },
  {
    "file": "frontend/src/app/pages/dashboard/components/feed-pajarero/components/create-feed-post/create-feed-post.component.scss",
    "errors": [
      "Línea 43: [alpha-value-notation] Expected \"0.1\" to be \"10%\" (alpha-value-notation)",
      "Línea 83: [alpha-value-notation] Expected \"0.1\" to be \"10%\" (alpha-value-notation)",
      "Línea 95: [alpha-value-notation] Expected \"0.15\" to be \"15%\" (alpha-value-notation)",
      "Línea 102: [alpha-value-notation] Expected \"0.04\" to be \"4%\" (alpha-value-notation)",
      "Línea 112: [alpha-value-notation] Expected \"0.2\" to be \"20%\" (alpha-value-notation)",
      "Línea 155: [alpha-value-notation] Expected \"0.65\" to be \"65%\" (alpha-value-notation)",
      "Línea 177: [alpha-value-notation] Expected \"0.08\" to be \"8%\" (alpha-value-notation)",
      "Línea 178: [alpha-value-notation] Expected \"0.2\" to be \"20%\" (alpha-value-notation)",
      "Línea 276: [alpha-value-notation] Expected \"0.04\" to be \"4%\" (alpha-value-notation)",
      "Línea 287: [alpha-value-notation] Expected \"0.2\" to be \"20%\" (alpha-value-notation)",
      "Línea 301: [alpha-value-notation] Expected \"0.12\" to be \"12%\" (alpha-value-notation)",
      "Línea 374: [alpha-value-notation] Expected \"0.35\" to be \"35%\" (alpha-value-notation)",
      "Línea 43: [color-function-alias-notation] Expected \"rgba\" to be \"rgb\" (color-function-alias-notation)",
      "Línea 83: [color-function-alias-notation] Expected \"rgba\" to be \"rgb\" (color-function-alias-notation)",
      "Línea 95: [color-function-alias-notation] Expected \"rgba\" to be \"rgb\" (color-function-alias-notation)",
      "Línea 102: [color-function-alias-notation] Expected \"rgba\" to be \"rgb\" (color-function-alias-notation)",
      "Línea 112: [color-function-alias-notation] Expected \"rgba\" to be \"rgb\" (color-function-alias-notation)",
      "Línea 155: [color-function-alias-notation] Expected \"rgba\" to be \"rgb\" (color-function-alias-notation)",
      "Línea 177: [color-function-alias-notation] Expected \"rgba\" to be \"rgb\" (color-function-alias-notation)",
      "Línea 178: [color-function-alias-notation] Expected \"rgba\" to be \"rgb\" (color-function-alias-notation)",
      "Línea 276: [color-function-alias-notation] Expected \"rgba\" to be \"rgb\" (color-function-alias-notation)",
      "Línea 287: [color-function-alias-notation] Expected \"rgba\" to be \"rgb\" (color-function-alias-notation)",
      "Línea 301: [color-function-alias-notation] Expected \"rgba\" to be \"rgb\" (color-function-alias-notation)",
      "Línea 374: [color-function-alias-notation] Expected \"rgba\" to be \"rgb\" (color-function-alias-notation)",
      "Línea 43: [color-function-notation] Expected modern color-function notation (color-function-notation)",
      "Línea 83: [color-function-notation] Expected modern color-function notation (color-function-notation)",
      "Línea 95: [color-function-notation] Expected modern color-function notation (color-function-notation)",
      "Línea 102: [color-function-notation] Expected modern color-function notation (color-function-notation)",
      "Línea 112: [color-function-notation] Expected modern color-function notation (color-function-notation)",
      "Línea 155: [color-function-notation] Expected modern color-function notation (color-function-notation)",
      "Línea 177: [color-function-notation] Expected modern color-function notation (color-function-notation)",
      "Línea 178: [color-function-notation] Expected modern color-function notation (color-function-notation)",
      "Línea 276: [color-function-notation] Expected modern color-function notation (color-function-notation)",
      "Línea 287: [color-function-notation] Expected modern color-function notation (color-function-notation)",
      "Línea 301: [color-function-notation] Expected modern color-function notation (color-function-notation)",
      "Línea 374: [color-function-notation] Expected modern color-function notation (color-function-notation)",
      "Línea 120: [custom-property-empty-line-before] Expected empty line before custom property (custom-property-empty-line-before)",
      "Línea 117: [declaration-empty-line-before] Expected empty line before declaration (declaration-empty-line-before)",
      "Línea 124: [declaration-empty-line-before] Expected empty line before declaration (declaration-empty-line-before)",
      "Línea 340: [declaration-empty-line-before] Expected empty line before declaration (declaration-empty-line-before)",
      "Línea 351: [declaration-empty-line-before] Expected empty line before declaration (declaration-empty-line-before)",
      "Línea 308: [no-descending-specificity] Expected selector \"ion-icon\" (\".subcard-icon-wrap ion-icon\") to come before selector \"ion-icon\" (\":is(:host-context(body.dark) .tool-btn) ion-icon\"), at line 267 (no-descending-specificity)",
      "Línea 382: [no-descending-specificity] Expected selector \"&:disabled\" (\".flock-publish-btn:disabled\") to come before selector \"&:active:not(:disabled)\" (\".flock-publish-btn:active:not(:disabled)\"), at line 378 (no-descending-specificity)",
      "Línea 388: [no-descending-specificity] Expected selector \"ion-icon\" (\".flock-publish-btn ion-icon\") to come before selector \"ion-icon\" (\":is(:host-context(body.dark) .tool-btn) ion-icon\"), at line 267 (no-descending-specificity)"
    ]
  }
]
```

**OUTPUT ESPERADO:**
Ejecuta la refactorización para estos archivos y entrégame los bloques de código corregidos.