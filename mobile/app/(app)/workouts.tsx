import AppText from "@/components/ui/AppText";
import Screen from "@/components/ui/Screen";
import { View } from "react-native";

export default function WorkoutsScreen() {
  return (
    <Screen className="px-4">
      <View className="flex-1 pt-4">
        <AppText variant="subtitle">Workouts</AppText>
        <AppText variant="muted" className="mt-2">
          This is the workouts tab.
        </AppText>
      </View>
    </Screen>
  );
}
