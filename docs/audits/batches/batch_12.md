# [SYSTEM OVERRIDE: ATOMIC REFACTORING MODE - BATCH 12]

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
    "file": "frontend/src/app/pages/sites/site-detail/site-detail.page.scss",
    "errors": [
      "Línea 4: [custom-property-empty-line-before] Expected empty line before custom property (custom-property-empty-line-before)",
      "Línea 3: [declaration-empty-line-before] Expected empty line before declaration (declaration-empty-line-before)",
      "Línea 5: [declaration-empty-line-before] Expected empty line before declaration (declaration-empty-line-before)"
    ]
  },
  {
    "file": "frontend/src/app/shared/components/auth-input/auth-input.component.scss",
    "errors": [
      "Línea 17: [alpha-value-notation] Expected \"0.08\" to be \"8%\" (alpha-value-notation)",
      "Línea 51: [alpha-value-notation] Expected \"0.08\" to be \"8%\" (alpha-value-notation)",
      "Línea 17: [color-function-alias-notation] Expected \"rgba\" to be \"rgb\" (color-function-alias-notation)",
      "Línea 51: [color-function-alias-notation] Expected \"rgba\" to be \"rgb\" (color-function-alias-notation)",
      "Línea 17: [color-function-notation] Expected modern color-function notation (color-function-notation)",
      "Línea 51: [color-function-notation] Expected modern color-function notation (color-function-notation)",
      "Línea 16: [color-hex-length] Expected \"#ffffff\" to be \"#fff\" (color-hex-length)"
    ]
  },
  {
    "file": "frontend/src/app/shared/components/geo-selector/geo-selector.component.scss",
    "errors": [
      "Línea 136: [alpha-value-notation] Expected \"0.08\" to be \"8%\" (alpha-value-notation)",
      "Línea 136: [color-function-alias-notation] Expected \"rgba\" to be \"rgb\" (color-function-alias-notation)",
      "Línea 136: [color-function-notation] Expected modern color-function notation (color-function-notation)",
      "Línea 57: [color-hex-length] Expected \"#ffffff\" to be \"#fff\" (color-hex-length)",
      "Línea 69: [color-hex-length] Expected \"#ffffff\" to be \"#fff\" (color-hex-length)",
      "Línea 135: [color-hex-length] Expected \"#ffffff\" to be \"#fff\" (color-hex-length)",
      "Línea 213: [no-descending-specificity] Expected selector \"&--selected\" (\"__item.geo-picker:is(--selected)\") to come before selector \"&:hover\" (\"__item.geo-picker:hover\"), at line 204 (no-descending-specificity)"
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
      "Línea 86: [color-hex-length] Expected \"#ffffff\" to be \"#fff\" (color-hex-length)",
      "Línea 106: [color-hex-length] Expected \"#ffffff\" to be \"#fff\" (color-hex-length)",
      "Línea 199: [no-descending-specificity] Expected selector \".role-card__arrow-btn\" to come before selector \".role-card__arrow-btn\" (\":is(.role-card:hover,.role-card:focus-visible) .role-card__arrow-btn\"), at line 104 (no-descending-specificity)",
      "Línea 271: [no-descending-specificity] Expected selector \".role-card__footer-icon\" to come before selector \".role-card__footer-icon\" (\":is(.role-card:hover,.role-card:focus-visible) .role-card__footer-icon\"), at line 110 (no-descending-specificity)",
      "Línea 61: [property-no-vendor-prefix] Vendor-prefixed property \"-webkit-background-clip\" (property-no-vendor-prefix)"
    ]
  }
]
```

**OUTPUT ESPERADO:**
Ejecuta la refactorización para estos archivos y entrégame los bloques de código corregidos.