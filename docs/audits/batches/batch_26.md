# [SYSTEM OVERRIDE: ATOMIC REFACTORING MODE - BATCH 26]

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
    "file": "frontend/src/app/pages/guides/guide-list/guide-list.page.scss",
    "errors": [
      "Línea 6: [declaration-block-single-line-max-declarations] Too many declarations, maximum 1 (declaration-block-single-line-max-declarations)",
      "Línea 7: [declaration-block-single-line-max-declarations] Too many declarations, maximum 1 (declaration-block-single-line-max-declarations)",
      "Línea 8: [declaration-block-single-line-max-declarations] Too many declarations, maximum 1 (declaration-block-single-line-max-declarations)",
      "Línea 9: [declaration-block-single-line-max-declarations] Too many declarations, maximum 1 (declaration-block-single-line-max-declarations)"
    ]
  },
  {
    "file": "frontend/src/app/pages/routes/route-workspace/route-workspace.page.scss",
    "errors": [
      "Línea 150: [declaration-block-single-line-max-declarations] Too many declarations, maximum 1 (declaration-block-single-line-max-declarations)",
      "Línea 151: [declaration-block-single-line-max-declarations] Too many declarations, maximum 1 (declaration-block-single-line-max-declarations)",
      "Línea 185: [declaration-block-single-line-max-declarations] Too many declarations, maximum 1 (declaration-block-single-line-max-declarations)",
      "Línea 186: [declaration-block-single-line-max-declarations] Too many declarations, maximum 1 (declaration-block-single-line-max-declarations)",
      "Línea 230: [declaration-block-single-line-max-declarations] Too many declarations, maximum 1 (declaration-block-single-line-max-declarations)",
      "Línea 231: [declaration-block-single-line-max-declarations] Too many declarations, maximum 1 (declaration-block-single-line-max-declarations)",
      "Línea 254: [declaration-block-single-line-max-declarations] Too many declarations, maximum 1 (declaration-block-single-line-max-declarations)",
      "Línea 255: [declaration-block-single-line-max-declarations] Too many declarations, maximum 1 (declaration-block-single-line-max-declarations)",
      "Línea 256: [declaration-block-single-line-max-declarations] Too many declarations, maximum 1 (declaration-block-single-line-max-declarations)",
      "Línea 208: [no-descending-specificity] Expected selector \"&::before\" (\":is(:is(::ng-deep) .timeline)::before\") to come before selector \"&::before\" (\":is(.workspace-grid .logger-section)::before\"), at line 36 (no-descending-specificity)",
      "Línea 66: [selector-pseudo-element-no-unknown] Unknown pseudo-element selector \"::ng-deep\" (selector-pseudo-element-no-unknown)"
    ]
  },
  {
    "file": "frontend/src/app/pages/routes/routes-landing/routes-landing.page.scss",
    "errors": [
      "Línea 22: [declaration-block-single-line-max-declarations] Too many declarations, maximum 1 (declaration-block-single-line-max-declarations)",
      "Línea 36: [no-descending-specificity] Expected selector \"ion-icon\" (\".empty-state ion-icon\") to come before selector \"ion-icon\" (\":is(.glass-card p) ion-icon\"), at line 22 (no-descending-specificity)"
    ]
  },
  {
    "file": "frontend/src/app/pages/profile/components/change-password.component.scss",
    "errors": [
      "Línea 107: [keyframes-name-pattern] Expected keyframe name \"fadeIn\" to be kebab-case (keyframes-name-pattern)"
    ]
  }
]
```

**OUTPUT ESPERADO:**
Ejecuta la refactorización para estos archivos y entrégame los bloques de código corregidos.