import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Slot } from "expo-router";

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
      <Slot />
    </ClerkProvider>
  );
}
