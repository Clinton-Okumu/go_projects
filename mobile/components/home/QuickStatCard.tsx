import AppText from "@/components/ui/AppText";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

type Props = {
  iconName: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
  onPress?: () => void;
};

export default function QuickStatCard({ iconName, value, label, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className="bg-app-card border border-app-border rounded-3xl px-4 py-4 flex-1 shadow-sm overflow-hidden"
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={onPress ? label : undefined}
    >
      <View pointerEvents="none" className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-brand/10" />

      <View className="w-11 h-11 rounded-full bg-app-bg items-center justify-center">
        <Ionicons name={iconName} size={20} color={COLORS.primary} />
      </View>

      <AppText className="mt-3 text-[20px] font-bold text-app-text">{value}</AppText>
      <AppText className="mt-1 text-[10px] uppercase tracking-wider text-app-muted font-semibold">
        {label}
      </AppText>
    </Pressable>
  );
}
