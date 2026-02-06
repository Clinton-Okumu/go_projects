import SectionLabel from "@/components/settings/SectionLabel";
import SettingsRow from "@/components/settings/SettingsRow";
import AppText from "@/components/ui/AppText";
import Screen from "@/components/ui/Screen";
import { COLORS } from "@/constants/colors";
import { useClerk, useUser } from "@clerk/clerk-expo";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useRouter } from "expo-router";
import { Alert, Pressable, ScrollView, View } from "react-native";

export default function SettingsScreen() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();

  const name =
    user?.fullName ||
    user?.firstName ||
    user?.username ||
    user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] ||
    "User";
  const email = user?.emailAddresses?.[0]?.emailAddress || "";

  const initials = (name || "U")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || "U";

  const handleLogout = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/(auth)/sign-in");
        },
      },
    ]);
  };

  return (
    <Screen className="px-4">
      <View className="flex-1">
        <View pointerEvents="none" className="absolute -top-24 -right-36 w-80 h-80 rounded-full bg-brand/10" />
        <View pointerEvents="none" className="absolute top-40 -left-44 w-72 h-72 rounded-full bg-brand/5" />

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: tabBarHeight + 20 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="pt-4">
            <View className="bg-brand/10 border border-brand/10 rounded-3xl p-4 overflow-hidden">
              <View pointerEvents="none" className="absolute -top-16 -right-20 w-56 h-56 rounded-full bg-white/50" />

              <AppText className="text-[26px] font-bold text-app-text">Settings</AppText>
              <AppText className="mt-1 text-[12px] text-app-muted">
                Manage your ForgeFit experience
              </AppText>

              <Pressable
                onPress={() => {}}
                className="mt-4 bg-app-card border border-app-border rounded-3xl px-4 py-4 flex-row items-center shadow-sm"
                accessibilityRole="button"
                accessibilityLabel="Account"
              >
                <View className="w-12 h-12 rounded-2xl bg-app-bg border border-app-border items-center justify-center">
                  <AppText className="text-[14px] font-bold text-app-text">{initials}</AppText>
                </View>

                <View className="flex-1 ml-3">
                  <AppText className="text-[14px] font-semibold text-app-text" numberOfLines={1}>
                    {name}
                  </AppText>
                  {email ? (
                    <AppText className="mt-1 text-[12px] text-app-muted" numberOfLines={1}>
                      {email}
                    </AppText>
                  ) : null}
                </View>

                <View className="w-10 h-10 rounded-2xl bg-app-bg border border-app-border items-center justify-center">
                  <AppText className="text-[12px] font-semibold text-brand">Edit</AppText>
                </View>
              </Pressable>
            </View>
          </View>

          <View className="mt-6">
            <SectionLabel title="Account & Preferences" />
            <View className="mt-3 bg-app-card border border-app-border rounded-3xl shadow-sm overflow-hidden">
              <SettingsRow
                title="Profile"
                iconName="person-outline"
                iconBgClassName="bg-sky-100"
                iconColor="#0277BD"
                onPress={() => Alert.alert("Profile", "Coming soon")}
              />
              <View className="h-px bg-app-border" />
              <SettingsRow
                title="Notifications"
                iconName="notifications-outline"
                iconBgClassName="bg-amber-100"
                iconColor="#F57C00"
                onPress={() => Alert.alert("Notifications", "Coming soon")}
              />
              <View className="h-px bg-app-border" />
              <SettingsRow
                title="App Theme"
                iconName="color-palette-outline"
                iconBgClassName="bg-indigo-100"
                iconColor="#3949AB"
                rightText="Ocean"
                onPress={() => Alert.alert("Theme", "Coming soon")}
              />
              <View className="h-px bg-app-border" />
              <SettingsRow
                title="Help & Support"
                iconName="help-circle-outline"
                iconBgClassName="bg-emerald-100"
                iconColor="#2E7D32"
                onPress={() => Alert.alert("Support", "Coming soon")}
              />
            </View>
          </View>

          <View className="mt-6">
            <SectionLabel title="Session" />
            <View className="mt-3 bg-app-card border border-app-border rounded-3xl shadow-sm overflow-hidden">
              <SettingsRow
                title="Log Out"
                iconName="log-out-outline"
                iconBgClassName="bg-danger/10"
                iconColor={COLORS.expense}
                onPress={handleLogout}
                danger
              />
            </View>
          </View>

          <View className="mt-8 items-center">
            <AppText className="text-[11px] text-app-muted">ForgeFit v2.4.1</AppText>
            <AppText className="mt-1 text-[10px] text-app-muted uppercase tracking-wider">
              Backend: Auth connected
            </AppText>
          </View>
        </ScrollView>
      </View>
    </Screen>
  );
}
