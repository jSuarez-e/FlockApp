# [SYSTEM OVERRIDE: ATOMIC REFACTORING MODE - BATCH 10]

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
      "Línea 49: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 63: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 63: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 92: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 113: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 128: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 191: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 199: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 199: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 203: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 203: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 203: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 205: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 205: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 205: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 205: [jsdoc/require-jsdoc] Missing JSDoc comment."
    ]
  },
  {
    "file": "shared/models/feed.model.ts",
    "errors": [
      "Línea 12: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 32: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 32: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 45: [jsdoc/require-jsdoc] Missing JSDoc comment.",
      "Línea 62: [jsdoc/require-jsdoc] Missing JSDoc comment."
    ]
  },
  {
    "file": "frontend/src/global.scss",
    "errors": [
      "Línea 316: [alpha-value-notation] Expected \"0.12\" to be \"12%\" (alpha-value-notation)",
      "Línea 316: [color-function-alias-notation] Expected \"rgba\" to be \"rgb\" (color-function-alias-notation)",
      "Línea 316: [color-function-notation] Expected modern color-function notation (color-function-notation)",
      "Línea 322: [color-hex-length] Expected \"#ffffff\" to be \"#fff\" (color-hex-length)",
      "Línea 331: [color-hex-length] Expected \"#ffffff\" to be \"#fff\" (color-hex-length)",
      "Línea 322: [custom-property-empty-line-before] Expected empty line before custom property (custom-property-empty-line-before)",
      "Línea 324: [custom-property-empty-line-before] Expected empty line before custom property (custom-property-empty-line-before)",
      "Línea 422: [custom-property-empty-line-before] Expected empty line before custom property (custom-property-empty-line-before)",
      "Línea 429: [custom-property-empty-line-before] Expected empty line before custom property (custom-property-empty-line-before)",
      "Línea 452: [custom-property-empty-line-before] Expected empty line before custom property (custom-property-empty-line-before)",
      "Línea 459: [custom-property-empty-line-before] Expected empty line before custom property (custom-property-empty-line-before)",
      "Línea 469: [custom-property-empty-line-before] Expected empty line before custom property (custom-property-empty-line-before)",
      "Línea 476: [custom-property-empty-line-before] Expected empty line before custom property (custom-property-empty-line-before)",
      "Línea 549: [custom-property-empty-line-before] Expected empty line before custom property (custom-property-empty-line-before)",
      "Línea 555: [custom-property-empty-line-before] Expected empty line before custom property (custom-property-empty-line-before)",
      "Línea 604: [custom-property-empty-line-before] Expected empty line before custom property (custom-property-empty-line-before)",
      "Línea 608: [custom-property-empty-line-before] Expected empty line before custom property (custom-property-empty-line-before)",
      "Línea 233: [declaration-empty-line-before] Expected empty line before declaration (declaration-empty-line-before)",
      "Línea 321: [declaration-empty-line-before] Expected empty line before declaration (declaration-empty-line-before)",
      "Línea 323: [declaration-empty-line-before] Expected empty line before declaration (declaration-empty-line-before)",
      "Línea 426: [declaration-empty-line-before] Expected empty line before declaration (declaration-empty-line-before)",
      "Línea 456: [declaration-empty-line-before] Expected empty line before declaration (declaration-empty-line-before)",
      "Línea 473: [declaration-empty-line-before] Expected empty line before declaration (declaration-empty-line-before)",
      "Línea 552: [declaration-empty-line-before] Expected empty line before declaration (declaration-empty-line-before)",
      "Línea 557: [declaration-empty-line-before] Expected empty line before declaration (declaration-empty-line-before)",
      "Línea 606: [declaration-empty-line-before] Expected empty line before declaration (declaration-empty-line-before)",
      "Línea 609: [declaration-empty-line-before] Expected empty line before declaration (declaration-empty-line-before)",
      "Línea 653: [no-descending-specificity] Expected selector \"ion-icon\" (\":is(.form-field .input-wrapper) ion-icon\") to come before selector \"ion-icon\" (\":is(:is(__avatar-circle.hero-image,__logo-circle.hero-image) .btn-edit-avatar-circular,:is(__avatar-circle.hero-image,__logo-circle.hero-image) .btn-edit-logo-circular) ion-icon\"), at line 614 (no-descending-specificity)",
      "Línea 820: [no-descending-specificity] Expected selector \".flock-subcard\" to come before selector \"&:last-child\" (\".flock-subcard:last-child\"), at line 512 (no-descending-specificity)",
      "Línea 809: [no-duplicate-selectors] Duplicate selector \".flock-outer-card\", first used at line 492 (no-duplicate-selectors)",
      "Línea 820: [no-duplicate-selectors] Duplicate selector \".flock-subcard\", first used at line 503 (no-duplicate-selectors)",
      "Línea 109: [property-no-vendor-prefix] Vendor-prefixed property \"-webkit-backdrop-filter\" (property-no-vendor-prefix)",
      "Línea 190: [property-no-vendor-prefix] Vendor-prefixed property \"-webkit-backdrop-filter\" (property-no-vendor-prefix)"
    ]
  },
  {
    "file": "frontend/src/app/pages/business-profile/business-profile.page.scss",
    "errors": [
      "Línea 43: [custom-property-empty-line-before] Expected empty line before custom property (custom-property-empty-line-before)",
      "Línea 82: [custom-property-empty-line-before] Expected empty line before custom property (custom-property-empty-line-before)",
      "Línea 86: [custom-property-empty-line-before] Expected empty line before custom property (custom-property-empty-line-before)",
      "Línea 46: [declaration-empty-line-before] Expected empty line before declaration (declaration-empty-line-before)",
      "Línea 84: [declaration-empty-line-before] Expected empty line before declaration (declaration-empty-line-before)",
      "Línea 87: [declaration-empty-line-before] Expected empty line before declaration (declaration-empty-line-before)",
      "Línea 399: [no-descending-specificity] Expected selector \"ion-icon\" (\":is(.provider-segment ion-segment-button) ion-icon\") to come before selector \"ion-icon\" (\":is(.hero-image .btn-edit-cover) ion-icon\"), at line 51 (no-descending-specificity)",
      "Línea 430: [no-descending-specificity] Expected selector \"ion-icon\" (\":is(.directory-status-card .directory-status-info) ion-icon\") to come before selector \"ion-icon\" (\":is(__avatar-circle.hero-image .btn-edit-avatar-circular) ion-icon\"), at line 92 (no-descending-specificity)"
    ]
  }
]
```

**OUTPUT ESPERADO:**
Ejecuta la refactorización para estos archivos y entrégame los bloques de código corregidos.