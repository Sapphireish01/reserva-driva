import React, { useEffect } from "react";
import { LogBox } from "react-native";
import { Slot } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts, Diplomata_400Regular } from "@expo-google-fonts/diplomata";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";

LogBox.ignoreLogs(["SafeAreaView has been deprecated"]);

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Diplomata: Diplomata_400Regular,
    Diplomata_400Regular,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <Slot />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}



