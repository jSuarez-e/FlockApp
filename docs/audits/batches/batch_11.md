# [SYSTEM OVERRIDE: ATOMIC REFACTORING MODE - BATCH 11]

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
    "file": "frontend/src/app/pages/main-layout/main-layout.page.scss",
    "errors": [
      "Línea 187: [declaration-empty-line-before] Expected empty line before declaration (declaration-empty-line-before)",
      "Línea 192: [no-descending-specificity] Expected selector \".logout-item ion-icon\" to come before selector \"ion-icon\" (\":is(.menu-profile-hero .role-badge) ion-icon\"), at line 144 (no-descending-specificity)",
      "Línea 196: [no-descending-specificity] Expected selector \".menu-item ion-icon\" to come before selector \"ion-icon\" (\":is(.menu-profile-hero .role-badge) ion-icon\"), at line 144 (no-descending-specificity)"
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
  },
  {
    "file": "frontend/src/app/pages/routes/route-workspace/route-workspace.page.scss",
    "errors": [
      "Línea 14: [custom-property-empty-line-before] Expected empty line before custom property (custom-property-empty-line-before)",
      "Línea 13: [declaration-empty-line-before] Expected empty line before declaration (declaration-empty-line-before)",
      "Línea 16: [declaration-empty-line-before] Expected empty line before declaration (declaration-empty-line-before)",
      "Línea 33: [declaration-empty-line-before] Expected empty line before declaration (declaration-empty-line-before)",
      "Línea 121: [media-feature-range-notation] Expected \"context\" media feature range notation (media-feature-range-notation)"
    ]
  }
]
```

**OUTPUT ESPERADO:**
Ejecuta la refactorización para estos archivos y entrégame los bloques de código corregidos.