import AppText from "@/components/ui/AppText";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, TextInput, View } from "react-native";

type Props = {
  index: number;
  weight: string;
  reps: string;
  done: boolean;
  showDivider?: boolean;
  onChangeWeight: (v: string) => void;
  onChangeReps: (v: string) => void;
  onToggleDone: () => void;
};

export default function SetRow({
  index,
  weight,
  reps,
  done,
  showDivider,
  onChangeWeight,
  onChangeReps,
  onToggleDone,
}: Props) {
  return (
    <View className={["flex-row items-center py-2", showDivider ? "border-b border-app-border" : ""].join(" ")}>
      <View className="w-10 items-center">
        <AppText className="text-[12px] font-semibold text-app-muted">{index + 1}</AppText>
      </View>

      <View className="flex-1">
        <TextInput
          value={weight}
          onChangeText={onChangeWeight}
          keyboardType="numeric"
          placeholder="---"
          placeholderTextColor={COLORS.textLight}
          selectionColor={COLORS.primary}
          className="bg-app-card border border-app-border rounded-xl px-3 py-2 text-[13px] text-app-text text-center"
        />
      </View>

      <View className="w-3" />

      <View className="flex-1">
        <TextInput
          value={reps}
          onChangeText={onChangeReps}
          keyboardType="numeric"
          placeholder="---"
          placeholderTextColor={COLORS.textLight}
          selectionColor={COLORS.primary}
          className="bg-app-card border border-app-border rounded-xl px-3 py-2 text-[13px] text-app-text text-center"
        />
      </View>

      <View className="w-3" />

      <View className="w-12 items-center">
        <Pressable
          onPress={onToggleDone}
          hitSlop={8}
          className={[
            "w-9 h-9 rounded-xl items-center justify-center border",
            done ? "bg-success border-success" : "bg-app-bg border-app-border",
          ].join(" ")}
          accessibilityRole="button"
          accessibilityLabel={done ? "Mark set incomplete" : "Mark set done"}
        >
          <Ionicons name="checkmark" size={16} color={done ? COLORS.white : COLORS.textLight} />
        </Pressable>
      </View>
    </View>
  );
}
