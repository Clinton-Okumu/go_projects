import AppText from "@/components/ui/AppText";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, View } from "react-native";

type Props = {
  overline?: string;
  name: string;
  avatarUri?: string | null;
  hasUnread?: boolean;
  onPressAvatar?: () => void;
  onPressNotifications?: () => void;
};

function getInitial(name: string) {
  const trimmed = String(name || "").trim();
  if (!trimmed) return "";
  return trimmed[0]?.toUpperCase() ?? "";
}

export default function HomeHeader({
  overline = "Good morning",
  name,
  avatarUri,
  hasUnread,
  onPressAvatar,
  onPressNotifications,
}: Props) {
  const initial = getInitial(name);

  return (
    <View className="flex-row items-center justify-between pt-4">
      <Pressable
        onPress={onPressAvatar}
        hitSlop={8}
        className="flex-row items-center gap-3 flex-1"
        accessibilityRole={onPressAvatar ? "button" : undefined}
        accessibilityLabel={onPressAvatar ? "Profile" : undefined}
      >
        <View className="w-11 h-11 rounded-full bg-app-card border border-app-border overflow-hidden items-center justify-center shadow-sm">
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} className="w-11 h-11" />
          ) : initial ? (
            <AppText className="text-app-text font-semibold">{initial}</AppText>
          ) : null}
        </View>

        <View className="flex-1">
          <AppText className="text-[10px] uppercase tracking-[1.2px] text-app-muted font-semibold">
            {overline}
          </AppText>
          <AppText className="text-[19px] font-semibold text-app-text">
            Welcome, {name}!
          </AppText>
        </View>
      </Pressable>

      <Pressable
        onPress={onPressNotifications}
        hitSlop={8}
        className="w-10 h-10 rounded-full bg-app-card border border-app-border items-center justify-center shadow-sm"
        accessibilityRole={onPressNotifications ? "button" : undefined}
        accessibilityLabel={onPressNotifications ? "Notifications" : undefined}
      >
        <Ionicons
          name="notifications-outline"
          size={20}
          color={COLORS.text}
        />
        {hasUnread ? (
          <View className="absolute top-2 right-2 w-2 h-2 rounded-full bg-danger" />
        ) : null}
      </Pressable>
    </View>
  );
}
