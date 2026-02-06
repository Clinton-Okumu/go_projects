import AppText from "@/components/ui/AppText";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { Pressable, View } from "react-native";
import SetRow from "./SetRow";

export type SetState = {
  weight: string;
  reps: string;
  done: boolean;
};

type Props = {
  title: string;
  prevLabel: string;
  sets: SetState[];
  onChangeSet: (index: number, patch: Partial<SetState>) => void;
  onAddSet: () => void;
  onOpenMenu?: () => void;
};

export default function LiveExerciseCard({
  title,
  prevLabel,
  sets,
  onChangeSet,
  onAddSet,
  onOpenMenu,
}: Props) {
  const completedCount = useMemo(() => sets.filter((s) => s.done).length, [sets]);

  return (
    <View className="bg-app-card border border-app-border rounded-3xl shadow-md overflow-hidden">
      <View className="px-4 pt-4 pb-3">
        <View className="flex-row items-start justify-between">
          <View className="flex-1 pr-3">
            <AppText className="text-[15px] font-semibold text-app-text" numberOfLines={1}>
              {title}
            </AppText>
            <View className="mt-1 flex-row items-center">
              <Ionicons name="reload-outline" size={14} color={COLORS.primary} />
              <AppText className="ml-1 text-[12px] text-brand" numberOfLines={1}>
                Prev: {prevLabel}
              </AppText>
            </View>
          </View>

          <View className="items-end">
            <Pressable
              onPress={onOpenMenu}
              hitSlop={8}
              className="w-9 h-9 rounded-xl bg-app-bg border border-app-border items-center justify-center"
              accessibilityRole={onOpenMenu ? "button" : undefined}
              accessibilityLabel={onOpenMenu ? "Exercise menu" : undefined}
            >
              <Ionicons name="ellipsis-horizontal" size={16} color={COLORS.textLight} />
            </Pressable>
            <AppText className="mt-2 text-[11px] text-app-muted">
              {completedCount}/{sets.length} done
            </AppText>
          </View>
        </View>

        <View className="mt-4 flex-row items-center bg-app-bg/60 border border-app-border rounded-2xl px-2 py-2">
          <View className="w-10 items-center">
            <AppText className="text-[10px] uppercase tracking-wider text-app-muted font-semibold">
              Set
            </AppText>
          </View>
          <View className="flex-1 items-center">
            <AppText className="text-[10px] uppercase tracking-wider text-app-muted font-semibold">
              Weight (lbs)
            </AppText>
          </View>
          <View className="w-3" />
          <View className="flex-1 items-center">
            <AppText className="text-[10px] uppercase tracking-wider text-app-muted font-semibold">
              Reps
            </AppText>
          </View>
          <View className="w-3" />
          <View className="w-12 items-center">
            <AppText className="text-[10px] uppercase tracking-wider text-app-muted font-semibold">
              Done
            </AppText>
          </View>
        </View>
      </View>

      <View className="px-4 pb-2">
        {sets.map((s, idx) => (
          <SetRow
            key={idx}
            index={idx}
            weight={s.weight}
            reps={s.reps}
            done={s.done}
            showDivider={idx !== sets.length - 1}
            onChangeWeight={(v) => onChangeSet(idx, { weight: v })}
            onChangeReps={(v) => onChangeSet(idx, { reps: v })}
            onToggleDone={() => onChangeSet(idx, { done: !s.done })}
          />
        ))}

        <Pressable
          onPress={onAddSet}
          className="mt-3 mb-3"
          accessibilityRole="button"
          accessibilityLabel="Add set"
        >
          {({ pressed }) => (
            <View
              className={[
                "border border-dashed border-brand/50 bg-brand/5 rounded-2xl py-3 items-center justify-center flex-row",
                pressed ? "opacity-90" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={{ transform: [{ scale: pressed ? 0.99 : 1 }] }}
            >
              <View className="w-8 h-8 rounded-full bg-app-card border border-app-border items-center justify-center">
                <Ionicons name="add" size={18} color={COLORS.primary} />
              </View>
              <AppText className="ml-2 text-[13px] font-semibold text-brand">Add Set</AppText>
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
}
