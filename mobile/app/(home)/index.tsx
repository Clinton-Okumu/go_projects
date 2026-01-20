import { SignOutButton } from "@/components/SignOutButton";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { getMe } from "../../lib/api";

export default function HomePage() {
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
    <View style={{ padding: 16 }}>
      {isSignedIn ? (
        <>
          <Text>Hello {user?.emailAddresses?.[0]?.emailAddress}</Text>
          {backendStatus ? <Text>Backend auth: {backendStatus}</Text> : null}
          <SignOutButton />
        </>
      ) : (
        <>
          <Link href="/(auth)/sign-in">
            <Text>Sign in</Text>
          </Link>
          <Link href="/(auth)/sign-up">
            <Text>Sign up</Text>
          </Link>
        </>
      )}
    </View>
  );
}
