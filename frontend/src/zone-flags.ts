/**
 * Prevents Angular change detection from
 * running with certain Web Component callbacks
 */

// fix: TS4111 - index signature property must be accessed with bracket notation
(window as Window & typeof globalThis & Record<string, unknown>)['__Zone_disable_customElements'] = true;
