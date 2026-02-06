import AppText from "@/components/ui/AppText";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

type Props = {
  title: string;
  subtitle: string;
  value: string;
  delta?: string;
  iconName: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
};

export default function PersonalRecordItem({
  title,
  subtitle,
  value,
  delta,
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
        <AppText className="text-[14px] font-semibold text-app-text" numberOfLines={1}>
          {title}
        </AppText>
        <AppText className="mt-1 text-[12px] text-app-muted" numberOfLines={1}>
          {subtitle}
        </AppText>
      </View>

      <View className="items-end">
        <AppText className="text-[12px] font-bold text-app-text">{value}</AppText>
        {delta ? (
          <AppText className="mt-1 text-[11px] text-success font-semibold">{delta}</AppText>
        ) : null}
      </View>
    </Pressable>
  );
}
