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
    "file": "frontend/src/global.scss",
    "errors": [
      "Línea 317: [alpha-value-notation] Expected \"0.12\" to be \"12%\" (alpha-value-notation)",
      "Línea 317: [color-function-alias-notation] Expected \"rgba\" to be \"rgb\" (color-function-alias-notation)",
      "Línea 317: [color-function-notation] Expected modern color-function notation (color-function-notation)",
      "Línea 323: [custom-property-empty-line-before] Expected empty line before custom property (custom-property-empty-line-before)",
      "Línea 325: [custom-property-empty-line-before] Expected empty line before custom property (custom-property-empty-line-before)",
      "Línea 423: [custom-property-empty-line-before] Expected empty line before custom property (custom-property-empty-line-before)",
      "Línea 430: [custom-property-empty-line-before] Expected empty line before custom property (custom-property-empty-line-before)",
      "Línea 453: [custom-property-empty-line-before] Expected empty line before custom property (custom-property-empty-line-before)",
      "Línea 460: [custom-property-empty-line-before] Expected empty line before custom property (custom-property-empty-line-before)",
      "Línea 470: [custom-property-empty-line-before] Expected empty line before custom property (custom-property-empty-line-before)",
      "Línea 477: [custom-property-empty-line-before] Expected empty line before custom property (custom-property-empty-line-before)",
      "Línea 550: [custom-property-empty-line-before] Expected empty line before custom property (custom-property-empty-line-before)",
      "Línea 556: [custom-property-empty-line-before] Expected empty line before custom property (custom-property-empty-line-before)",
      "Línea 605: [custom-property-empty-line-before] Expected empty line before custom property (custom-property-empty-line-before)",
      "Línea 609: [custom-property-empty-line-before] Expected empty line before custom property (custom-property-empty-line-before)",
      "Línea 234: [declaration-empty-line-before] Expected empty line before declaration (declaration-empty-line-before)",
      "Línea 322: [declaration-empty-line-before] Expected empty line before declaration (declaration-empty-line-before)",
      "Línea 324: [declaration-empty-line-before] Expected empty line before declaration (declaration-empty-line-before)",
      "Línea 427: [declaration-empty-line-before] Expected empty line before declaration (declaration-empty-line-before)",
      "Línea 457: [declaration-empty-line-before] Expected empty line before declaration (declaration-empty-line-before)",
      "Línea 474: [declaration-empty-line-before] Expected empty line before declaration (declaration-empty-line-before)",
      "Línea 553: [declaration-empty-line-before] Expected empty line before declaration (declaration-empty-line-before)",
      "Línea 558: [declaration-empty-line-before] Expected empty line before declaration (declaration-empty-line-before)",
      "Línea 607: [declaration-empty-line-before] Expected empty line before declaration (declaration-empty-line-before)",
      "Línea 610: [declaration-empty-line-before] Expected empty line before declaration (declaration-empty-line-before)",
      "Línea 654: [no-descending-specificity] Expected selector \"ion-icon\" (\":is(.form-field .input-wrapper) ion-icon\") to come before selector \"ion-icon\" (\":is(:is(__avatar-circle.hero-image,__logo-circle.hero-image) .btn-edit-avatar-circular,:is(__avatar-circle.hero-image,__logo-circle.hero-image) .btn-edit-logo-circular) ion-icon\"), at line 615 (no-descending-specificity)",
      "Línea 821: [no-descending-specificity] Expected selector \".flock-subcard\" to come before selector \"&:last-child\" (\".flock-subcard:last-child\"), at line 513 (no-descending-specificity)",
      "Línea 810: [no-duplicate-selectors] Duplicate selector \".flock-outer-card\", first used at line 493 (no-duplicate-selectors)",
      "Línea 821: [no-duplicate-selectors] Duplicate selector \".flock-subcard\", first used at line 504 (no-duplicate-selectors)",
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
      "Línea 151: [no-descending-specificity] Expected selector \"ion-icon\" (\":is(.provider-segment ion-segment-button) ion-icon\") to come before selector \"ion-icon\" (\":is(.hero-image .btn-edit-cover) ion-icon\"), at line 51 (no-descending-specificity)"
    ]
  },
  {
    "file": "frontend/src/app/pages/profile/profile.page.scss",
    "errors": [
      "Línea 110: [alpha-value-notation] Expected \"0.6\" to be \"60%\" (alpha-value-notation)",
      "Línea 121: [alpha-value-notation] Expected \"0.35\" to be \"35%\" (alpha-value-notation)",
      "Línea 110: [color-function-alias-notation] Expected \"rgba\" to be \"rgb\" (color-function-alias-notation)",
      "Línea 121: [color-function-alias-notation] Expected \"rgba\" to be \"rgb\" (color-function-alias-notation)",
      "Línea 110: [color-function-notation] Expected modern color-function notation (color-function-notation)",
      "Línea 121: [color-function-notation] Expected modern color-function notation (color-function-notation)",
      "Línea 110: [custom-property-empty-line-before] Expected empty line before custom property (custom-property-empty-line-before)",
      "Línea 116: [custom-property-empty-line-before] Expected empty line before custom property (custom-property-empty-line-before)",
      "Línea 156: [custom-property-empty-line-before] Expected empty line before custom property (custom-property-empty-line-before)",
      "Línea 160: [custom-property-empty-line-before] Expected empty line before custom property (custom-property-empty-line-before)",
      "Línea 352: [custom-property-empty-line-before] Expected empty line before custom property (custom-property-empty-line-before)",
      "Línea 113: [declaration-empty-line-before] Expected empty line before declaration (declaration-empty-line-before)",
      "Línea 118: [declaration-empty-line-before] Expected empty line before declaration (declaration-empty-line-before)",
      "Línea 158: [declaration-empty-line-before] Expected empty line before declaration (declaration-empty-line-before)",
      "Línea 161: [declaration-empty-line-before] Expected empty line before declaration (declaration-empty-line-before)",
      "Línea 244: [no-descending-specificity] Expected selector \"ion-icon\" (\":is(.stat-subcard .subcard-title) ion-icon\") to come before selector \"ion-icon\" (\":is(__avatar-circle.hero-image .btn-edit-avatar-circular) ion-icon\"), at line 166 (no-descending-specificity)",
      "Línea 281: [no-descending-specificity] Expected selector \"ion-icon\" (\":is(.form-subcard .subcard-title) ion-icon\") to come before selector \"ion-icon\" (\":is(__avatar-circle.hero-image .btn-edit-avatar-circular) ion-icon\"), at line 166 (no-descending-specificity)",
      "Línea 325: [no-descending-specificity] Expected selector \"ion-icon\" (\".input-wrapper ion-icon\") to come before selector \"ion-icon\" (\":is(.hero-image .btn-edit-cover) ion-icon\"), at line 124 (no-descending-specificity)"
    ]
  },
  {
    "file": "frontend/src/app/pages/guides/guide-detail/guide-detail.page.scss",
    "errors": [
      "Línea 93: [custom-property-empty-line-before] Expected empty line before custom property (custom-property-empty-line-before)",
      "Línea 92: [declaration-empty-line-before] Expected empty line before declaration (declaration-empty-line-before)",
      "Línea 94: [declaration-empty-line-before] Expected empty line before declaration (declaration-empty-line-before)",
      "Línea 134: [no-duplicate-selectors] Duplicate selector \".content-wrapper\", first used at line 20 (no-duplicate-selectors)"
    ]
  }
]
```

**OUTPUT ESPERADO:**
Ejecuta la refactorización para estos archivos y entrégame los bloques de código corregidos.