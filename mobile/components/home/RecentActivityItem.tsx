import AppText from "@/components/ui/AppText";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

type Props = {
  title: string;
  when: string;
  duration: string;
  metric: string;
  iconName: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
};

export default function RecentActivityItem({
  title,
  when,
  duration,
  metric,
  iconName,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className="bg-app-card border border-app-border rounded-2xl px-4 py-3 flex-row items-center shadow-sm"
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={onPress ? title : undefined}
    >
      <View className="w-10 h-10 rounded-full bg-app-bg items-center justify-center">
        <Ionicons name={iconName} size={18} color={COLORS.primary} />
      </View>

      <View className="flex-1 ml-3">
        <View className="flex-row items-center justify-between">
          <AppText className="text-[14px] font-semibold text-app-text flex-1" numberOfLines={1}>
            {title}
          </AppText>
          <View className="ml-2 px-2 py-1 rounded-full bg-app-bg border border-app-border">
            <AppText className="text-[10px] uppercase tracking-wider text-app-muted font-semibold">
              {when}
            </AppText>
          </View>
        </View>

        <View className="mt-1 flex-row items-center">
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={13} color={COLORS.textLight} />
            <AppText className="ml-1 text-[12px] text-app-muted">{duration}</AppText>
          </View>
          <View className="w-4" />
          <View className="flex-row items-center">
            <Ionicons name="barbell-outline" size={13} color={COLORS.textLight} />
            <AppText className="ml-1 text-[12px] text-app-muted">{metric}</AppText>
          </View>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={18} color={COLORS.textLight} />
    </Pressable>
  );
}
