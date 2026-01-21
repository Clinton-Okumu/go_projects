import { SignOutButton } from "@/components/SignOutButton";
import SafeScreen from "@/components/SafeScreen";
import { COLORS } from "@/constants/colors";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
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
    <SafeScreen>
      <View style={{ flex: 1, padding: 16, backgroundColor: COLORS.background }}>
        <Text style={{ fontSize: 18, fontWeight: "600", color: COLORS.text }}>
          Home
        </Text>

        <Text style={{ marginTop: 8, color: COLORS.text }}>
          Hello {user?.emailAddresses?.[0]?.emailAddress}
        </Text>

        {backendStatus ? (
          <Text style={{ marginTop: 8, color: COLORS.textLight }}>
            Backend auth: {backendStatus}
          </Text>
        ) : null}

        <View style={{ marginTop: 16 }}>
          <SignOutButton />
        </View>
      </View>
    </SafeScreen>
  );
}
