import AppText from "@/components/ui/AppText";
import Screen from "@/components/ui/Screen";
import { View } from "react-native";

export default function StatsScreen() {
  return (
    <Screen className="px-4">
      <View className="flex-1 pt-4">
        <AppText variant="subtitle">Stats</AppText>
        <AppText variant="muted" className="mt-2">
          Weekly volume, PRs, and progress charts.
        </AppText>
      </View>
    </Screen>
  );
}
