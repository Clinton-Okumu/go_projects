import "../global.css";

import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import PageLoader from "@/components/PageLoader";
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { LogBox } from "react-native";

if (__DEV__) {
  LogBox.ignoreLogs(["SafeAreaView has been deprecated", "Unable to activate keep awake"]);
}

export default function RootLayout() {
  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <AuthGate />
    </ClerkProvider>
  );
}

function AuthGate() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const root = segments[0];
    const inAuthGroup = root === "(auth)";
    const inAppGroup = root === "(app)";

    if (!isSignedIn && inAppGroup) {
      router.replace("/(auth)/sign-in");
    }

    if (isSignedIn && inAuthGroup) {
      router.replace("/(app)/home");
    }
  }, [isLoaded, isSignedIn, router, segments]);

  if (!isLoaded) return <PageLoader />;
  return <Slot />;
}
