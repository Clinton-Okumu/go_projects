import { useUser } from "@clerk/clerk-expo";
import { SignOutButton } from "@/components/SignOutButton";
import AppText from "@/components/ui/AppText";
import Screen from "@/components/ui/Screen";
import { View } from "react-native";

export default function SettingsScreen() {
  const { user } = useUser();

  return (
    <Screen className="px-4">
      <View className="flex-1 pt-4">
        <AppText variant="subtitle">Settings</AppText>
        <AppText className="mt-2">
          {user?.emailAddresses?.[0]?.emailAddress || "Signed in"}
        </AppText>
        <View className="mt-4">
          <SignOutButton />
        </View>
      </View>
    </Screen>
  );
}
