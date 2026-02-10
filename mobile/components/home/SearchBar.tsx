import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, TextInput, View } from "react-native";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
  onPress?: () => void;
  className?: string;
};

export default function SearchBar({
  value,
  onChangeText,
  placeholder = "Search exercises or routines...",
  onSubmit,
  onPress,
  className,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      className={[
        "bg-app-card border border-app-border rounded-3xl px-3 py-3 flex-row items-center shadow-sm",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={onPress ? "Search" : undefined}
    >
      <View className="w-10 h-10 rounded-2xl bg-app-bg items-center justify-center">
        <Ionicons name="search-outline" size={18} color={COLORS.primary} />
      </View>
      <View className="w-3" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textLight}
        selectionColor={COLORS.primary}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        className="flex-1 text-[15px] text-app-text"
      />
    </Pressable>
  );
}
