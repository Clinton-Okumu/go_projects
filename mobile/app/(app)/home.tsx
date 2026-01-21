import { SignOutButton } from "@/components/SignOutButton";
import AppText from "@/components/ui/AppText";
import Screen from "@/components/ui/Screen";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { getMe } from "../../lib/api";

export default function HomeScreen() {
  const { user } = useUser();
  const { isSignedIn, getToken } = useAuth();
  const [backendStatus, setBackendStatus] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!isSignedIn) {
        if (!cancelled) setBackendStatus("");
        return;
      }

      try {
        await getMe(getToken);
        if (!cancelled) setBackendStatus("ok");
      } catch {
        if (!cancelled) setBackendStatus("unreachable");
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [getToken, isSignedIn]);

  return (
    <Screen className="px-4">
      <View className="flex-1 pt-4">
        <AppText variant="subtitle">Home</AppText>
        <AppText className="mt-2">
          Hello {user?.emailAddresses?.[0]?.emailAddress}
        </AppText>

        {backendStatus ? (
          <AppText variant="muted" className="mt-2">
            Backend auth: {backendStatus}
          </AppText>
        ) : null}

        <View className="mt-4">
          <SignOutButton />
        </View>
      </View>
    </Screen>
  );
}
