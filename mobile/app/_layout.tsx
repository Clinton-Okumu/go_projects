import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import PageLoader from "@/components/PageLoader";
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

// Expo SDK sometimes tries to enable keep-awake in dev via DevTools.
// On some Android devices/emulators this can fail very early (no Activity yet),
// surfacing as an annoying red screen even though the app works.
// Swallow ONLY this specific dev error.
if (__DEV__) {
  const msg = "Unable to activate keep awake";
  const g: any = global;
  const ErrorUtils = g?.ErrorUtils;
  if (ErrorUtils?.getGlobalHandler && ErrorUtils?.setGlobalHandler) {
    const prev = ErrorUtils.getGlobalHandler();
    ErrorUtils.setGlobalHandler((err: any, isFatal: boolean) => {
      const text = String(err?.message || err);
      if (text.includes(msg)) return;
      prev(err, isFatal);
    });
  }
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
