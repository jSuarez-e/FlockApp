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
    "file": "frontend/src/app/shared/components/geo-selector/geo-selector.component.scss",
    "errors": [
      "Línea 136: [alpha-value-notation] Expected \"0.08\" to be \"8%\" (alpha-value-notation)",
      "Línea 136: [color-function-alias-notation] Expected \"rgba\" to be \"rgb\" (color-function-alias-notation)",
      "Línea 136: [color-function-notation] Expected modern color-function notation (color-function-notation)",
      "Línea 213: [no-descending-specificity] Expected selector \"&--selected\" (\"__item.geo-picker:is(--selected)\") to come before selector \"&:hover\" (\"__item.geo-picker:hover\"), at line 204 (no-descending-specificity)"
    ]
  },
  {
    "file": "frontend/src/app/shared/components/otp-input/otp-input.component.scss",
    "errors": [
      "Línea 30: [alpha-value-notation] Expected \"0.12\" to be \"12%\" (alpha-value-notation)",
      "Línea 30: [color-function-alias-notation] Expected \"rgba\" to be \"rgb\" (color-function-alias-notation)",
      "Línea 30: [color-function-notation] Expected modern color-function notation (color-function-notation)",
      "Línea 36: [property-no-vendor-prefix] Vendor-prefixed property \"-webkit-appearance\" (property-no-vendor-prefix)",
      "Línea 11: [shorthand-property-no-redundant-values] Expected \"10px 0 20px 0\" to be \"10px 0 20px\" (shorthand-property-no-redundant-values)"
    ]
  },
  {
    "file": "frontend/src/app/shared/components/stat-widget/stat-widget.component.scss",
    "errors": [
      "Línea 24: [alpha-value-notation] Expected \"0.04\" to be \"4%\" (alpha-value-notation)",
      "Línea 24: [color-function-alias-notation] Expected \"rgba\" to be \"rgb\" (color-function-alias-notation)",
      "Línea 24: [color-function-notation] Expected modern color-function notation (color-function-notation)"
    ]
  },
  {
    "file": "frontend/src/app/pages/business-profile/components/business-bookings-tab/business-bookings-tab.component.scss",
    "errors": [
      "Línea 106: [custom-property-empty-line-before] Expected empty line before custom property (custom-property-empty-line-before)",
      "Línea 159: [custom-property-empty-line-before] Expected empty line before custom property (custom-property-empty-line-before)",
      "Línea 108: [declaration-empty-line-before] Expected empty line before declaration (declaration-empty-line-before)"
    ]
  }
]
```

**OUTPUT ESPERADO:**
Ejecuta la refactorización para estos archivos y entrégame los bloques de código corregidos.