import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Rezarva Driver',
  slug: config.slug || 'rezarva-driver',
  version: config.version || '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'rezarvadriver',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.rezarva.driver',
    buildNumber: '1',
    infoPlist: {
      NSCameraUsageDescription:
        "Rezarva Driver requires camera access to capture your driver's license and vehicle documents for account verification.",
      NSPhotoLibraryUsageDescription:
        'Rezarva Driver requires access to your photo library to select and upload document photos.',
    },
    config: {
      googleMapsApiKey:
        process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ||
        'AIzaSyCsS8_vpksMH8am-80GESDs44YOtjjCtLw',
    },
  },
  android: {
    package: 'com.rezarva.driver',
    versionCode: 1,
    permissions: [
      'CAMERA',
      'READ_EXTERNAL_STORAGE',
      'WRITE_EXTERNAL_STORAGE',
    ],
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    config: {
      googleMaps: {
        apiKey:
          process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ||
          'AIzaSyCsS8_vpksMH8am-80GESDs44YOtjjCtLw',
      },
    },
  },
  web: {
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-camera',
      {
        cameraPermission:
          "Rezarva Driver requires camera access to capture your driver's license and vehicle documents for account verification.",
      },
    ],
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
        dark: {
          backgroundColor: '#000000',
        },
      },
    ],
    'expo-secure-store',
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    router: {},
    eas: {
      projectId: '4302d869-d8c1-4534-b6c0-c60bf08bb62c',
    },
  },
});
