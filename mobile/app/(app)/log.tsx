import SafeScreen from "@/components/SafeScreen";
import { COLORS } from "@/constants/colors";
import { Text, View } from "react-native";

export default function LogScreen() {
  return (
    <SafeScreen>
      <View style={{ flex: 1, padding: 16, backgroundColor: COLORS.background }}>
        <Text style={{ fontSize: 18, fontWeight: "600", color: COLORS.text }}>
          Log
        </Text>
        <Text style={{ marginTop: 8, color: COLORS.textLight }}>
          Your recent workouts will show here.
        </Text>
      </View>
    </SafeScreen>
  );
}
