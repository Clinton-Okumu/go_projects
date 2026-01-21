import AppText from "@/components/ui/AppText";
import Screen from "@/components/ui/Screen";
import { View } from "react-native";

export default function LogScreen() {
  return (
    <Screen className="px-4">
      <View className="flex-1 pt-4">
        <AppText variant="subtitle">Log</AppText>
        <AppText variant="muted" className="mt-2">
          Your recent workouts will show here.
        </AppText>
      </View>
    </Screen>
  );
}
