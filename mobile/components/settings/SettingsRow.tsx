import AppText from "@/components/ui/AppText";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

type Props = {
  title: string;
  subtitle?: string;
  iconName: keyof typeof Ionicons.glyphMap;
  iconBgClassName?: string;
  iconColor?: string;
  rightText?: string;
  onPress?: () => void;
  danger?: boolean;
};

export default function SettingsRow({
  title,
  subtitle,
  iconName,
  iconBgClassName = "bg-app-bg",
  iconColor,
  rightText,
  onPress,
  danger,
}: Props) {
  const textColor = danger ? "text-danger" : "text-app-text";

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className="px-4 py-3 flex-row items-center"
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={onPress ? title : undefined}
    >
      <View className={["w-10 h-10 rounded-2xl items-center justify-center", iconBgClassName].join(" ")}>
        <Ionicons
          name={iconName}
          size={18}
          color={iconColor ?? (danger ? COLORS.expense : COLORS.primary)}
        />
      </View>

      <View className="flex-1 ml-3">
        <AppText className={["text-[14px] font-semibold", textColor].join(" ")}>{title}</AppText>
        {subtitle ? <AppText className="mt-1 text-[12px] text-app-muted">{subtitle}</AppText> : null}
      </View>

      {rightText ? <AppText className="text-[12px] text-app-muted font-semibold">{rightText}</AppText> : null}
      <Ionicons name="chevron-forward" size={18} color={COLORS.textLight} />
    </Pressable>
  );
}
