import AppText from "@/components/ui/AppText";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

type Props = {
  title: string;
  subtitle: string;
  exerciseCount: number;
  iconName: keyof typeof Ionicons.glyphMap;
  iconBgClassName: string;
  iconColor?: string;
  onPress?: () => void;
};

export default function RoutineListItem({
  title,
  subtitle,
  exerciseCount,
  iconName,
  iconBgClassName,
  iconColor,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={onPress ? title : undefined}
    >
      {({ pressed }) => (
        <View
          className={[
            "bg-app-card border border-app-border rounded-2xl px-4 py-3 flex-row items-center shadow-sm",
            pressed ? "opacity-90" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          style={{ transform: [{ scale: pressed ? 0.99 : 1 }] }}
        >
          <View
            className={[
              "w-11 h-11 rounded-2xl items-center justify-center border border-white/60",
              iconBgClassName,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <Ionicons name={iconName} size={20} color={iconColor ?? COLORS.primary} />
          </View>

          <View className="flex-1 ml-3">
            <AppText className="text-[14px] font-semibold text-app-text" numberOfLines={1}>
              {title}
            </AppText>
            <AppText className="mt-1 text-[12px] text-app-muted" numberOfLines={1}>
              {subtitle} | {exerciseCount} exercises
            </AppText>
          </View>

          <Ionicons name="chevron-forward" size={18} color={COLORS.textLight} />
        </View>
      )}
    </Pressable>
  );
}
