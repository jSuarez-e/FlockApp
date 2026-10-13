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
      "Línea 74: [color-hex-length] Expected \"#ffffff\" to be \"#fff\" (color-hex-length)",
      "Línea 86: [custom-property-empty-line-before] Expected empty line before custom property (custom-property-empty-line-before)",
      "Línea 76: [declaration-empty-line-before] Expected empty line before declaration (declaration-empty-line-before)"
    ]
  }
]
```

**OUTPUT ESPERADO:**
Ejecuta la refactorización para estos archivos y entrégame los bloques de código corregidos.