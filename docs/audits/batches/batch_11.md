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
    "file": "frontend/src/app/pages/routes/route-workspace/route-workspace.page.scss",
    "errors": [
      "Línea 14: [custom-property-empty-line-before] Expected empty line before custom property (custom-property-empty-line-before)",
      "Línea 13: [declaration-empty-line-before] Expected empty line before declaration (declaration-empty-line-before)",
      "Línea 16: [declaration-empty-line-before] Expected empty line before declaration (declaration-empty-line-before)",
      "Línea 33: [declaration-empty-line-before] Expected empty line before declaration (declaration-empty-line-before)",
      "Línea 121: [media-feature-range-notation] Expected \"context\" media feature range notation (media-feature-range-notation)"
    ]
  },
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
      "Línea 51: [color-function-notation] Expected modern color-function notation (color-function-notation)"
    ]
  },
  {
    "file": "frontend/src/app/shared/components/brand-header/brand-header.component.scss",
    "errors": [
      "Línea 15: [custom-property-empty-line-before] Expected empty line before custom property (custom-property-empty-line-before)",
      "Línea 19: [shorthand-property-no-redundant-values] Expected \"8px 0 0 0\" to be \"8px 0 0\" (shorthand-property-no-redundant-values)"
    ]
  }
]
```

**OUTPUT ESPERADO:**
Ejecuta la refactorización para estos archivos y entrégame los bloques de código corregidos.