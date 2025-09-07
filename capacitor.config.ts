import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fichajes.app',
  appName: 'fichajesPersonal',
  webDir: 'www',
  android: {
    adjustMarginsForEdgeToEdge: 'auto'
  },
  plugins: {
    FirebaseAuthentication: {
      providers: ['google.com'],
      skipNativeAuth: false
    },
    SplashScreen: {
      launchShowDuration: 0,
      launchAutoHide: false,
      backgroundColor: "#ffffffff",
      showSpinner: true
    },
  }
};

export default config;
