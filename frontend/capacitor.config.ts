import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.alasalvuelo.app',
  appName: 'FlockApp',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      // 1. Evita que se cierre solo. Nuestro app.component.ts lo cerrará.
      launchAutoHide: false,

      // 2. Color de fondo verde principal de nuestra paleta FlockApp
      backgroundColor: '#108346',

      // 3. Estilo de la imagen nativa (evita que se deforme en pantallas largas)
      androidScaleType: 'CENTER_CROP',

      // 4. Muestra un "spinner" (ruedita de carga) nativo
      showSpinner: true,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',

      // 5. El spinner será blanco para que contraste con el fondo verde
      spinnerColor: '#ffffff',

      // 6. El splash ocupará toda la pantalla, tapando la barra de estado superior
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      overlaysWebView: false,
      style: 'DARK',
      backgroundColor: '#064e3b',
    },
  },
};

export default config;

