import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import PageLoader from "@/components/PageLoader";

export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return <PageLoader />;

  if (isSignedIn) {
    return <Redirect href="/(app)/home" />;
  }

  return <Redirect href="/(auth)/sign-in" />;
}
