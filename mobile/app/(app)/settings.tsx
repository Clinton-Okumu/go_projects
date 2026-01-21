import { useUser } from "@clerk/clerk-expo";
import SafeScreen from "@/components/SafeScreen";
import { SignOutButton } from "@/components/SignOutButton";
import { COLORS } from "@/constants/colors";
import { Text, View } from "react-native";

export default function SettingsScreen() {
  const { user } = useUser();

  return (
    <SafeScreen>
      <View style={{ flex: 1, padding: 16, backgroundColor: COLORS.background }}>
        <Text style={{ fontSize: 18, fontWeight: "600", color: COLORS.text }}>
          Settings
        </Text>
        <Text style={{ marginTop: 8, color: COLORS.text }}>
          {user?.emailAddresses?.[0]?.emailAddress || "Signed in"}
        </Text>
        <View style={{ marginTop: 16 }}>
          <SignOutButton />
        </View>
      </View>
    </SafeScreen>
  );
}
