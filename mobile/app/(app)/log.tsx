import LiveExerciseCard, { SetState } from "@/components/log/LiveExerciseCard";
import WorkoutTimer from "@/components/log/WorkoutTimer";
import AppText from "@/components/ui/AppText";
import Button from "@/components/ui/Button";
import Screen from "@/components/ui/Screen";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, View } from "react-native";

export default function LogScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const [sets, setSets] = useState<SetState[]>([
    { weight: "135", reps: "10", done: true },
    { weight: "", reps: "", done: false },
  ]);

  const completed = useMemo(() => sets.filter((s) => s.done).length, [sets]);

  return (
    <Screen className="px-4">
      <View className="flex-1">
        <View
          pointerEvents="none"
          className="absolute -top-24 -right-36 w-80 h-80 rounded-full bg-brand/10"
        />
        <View
          pointerEvents="none"
          className="absolute top-40 -left-44 w-72 h-72 rounded-full bg-brand/5"
        />

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: tabBarHeight + 24 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="pt-4">
            <View className="bg-brand/10 border border-brand/10 rounded-3xl p-4 overflow-hidden">
              <View pointerEvents="none" className="absolute -top-16 -right-20 w-56 h-56 rounded-full bg-white/50" />

              <View className="flex-row items-center justify-between">
                <View className="px-3 py-1 rounded-full bg-app-card border border-app-border">
                  <AppText className="text-[11px] uppercase tracking-wider text-app-muted font-semibold">
                    Live Workout Log
                  </AppText>
                </View>

                <WorkoutTimer
                  initialSeconds={60 * 42 + 15}
                  mode="inline"
                  className="px-3 py-1 rounded-full bg-app-card border border-app-border"
                />
              </View>

              <View className="mt-4 flex-row items-end justify-between">
                <View className="flex-1 pr-3">
                  <AppText className="text-[26px] font-bold text-app-text">Live Workout</AppText>
                  <AppText className="mt-1 text-[12px] text-app-muted">Push Day - Morning Session</AppText>
                </View>

                <View className="px-3 py-1 rounded-full bg-app-card border border-app-border">
                  <AppText className="text-[11px] font-semibold text-app-text">
                    {completed}/{sets.length} sets
                  </AppText>
                </View>
              </View>
            </View>
          </View>

          <View className="mt-5">
            <LiveExerciseCard
              title="Bench Press (Barbell)"
              prevLabel="135 lbs x 10"
              sets={sets}
              onChangeSet={(index, patch) =>
                setSets((prev) =>
                  prev.map((s, i) => (i === index ? { ...s, ...patch } : s))
                )
              }
              onAddSet={() => setSets((prev) => [...prev, { weight: "", reps: "", done: false }])}
              onOpenMenu={() => Alert.alert("Exercise", "Menu coming soon")}
            />
          </View>

          <View className="mt-4">
            <Pressable
              onPress={() => Alert.alert("Next exercise", "Open next exercise")}
              accessibilityRole="button"
              accessibilityLabel="Incline dumbbell press"
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
                  <View className="w-10 h-10 rounded-full bg-app-bg items-center justify-center">
                    <Ionicons name="checkmark" size={18} color={COLORS.primary} />
                  </View>
                  <View className="flex-1 ml-3">
                    <AppText className="text-[14px] font-semibold text-app-text">
                      Incline DB Press
                    </AppText>
                    <AppText className="mt-1 text-[12px] text-app-muted">3 sets completed</AppText>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={COLORS.textLight} />
                </View>
              )}
            </Pressable>
          </View>

          <Pressable
            onPress={() => Alert.alert("Add exercise", "Add next exercise")}
            accessibilityRole="button"
            accessibilityLabel="Add next exercise"
            className="mt-4"
          >
            {({ pressed }) => (
              <View
                className={[
                  "border border-dashed border-app-border bg-app-card/40 rounded-3xl px-4 py-6 items-center justify-center",
                  pressed ? "opacity-90" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                style={{ transform: [{ scale: pressed ? 0.99 : 1 }] }}
              >
                <View className="w-12 h-12 rounded-full bg-app-card border border-app-border items-center justify-center">
                  <Ionicons name="swap-vertical" size={20} color={COLORS.textLight} />
                </View>
                <AppText className="mt-3 text-[13px] font-semibold text-app-muted">
                  Add Next Exercise
                </AppText>
              </View>
            )}
          </Pressable>

          <View className="mt-5 flex-row">
            <Pressable
              onPress={() => Alert.alert("Discard", "Workout discarded")}
              accessibilityRole="button"
              accessibilityLabel="Discard workout"
              className="flex-1"
            >
              {({ pressed }) => (
                <View
                  className={[
                    "bg-danger/10 border border-danger/30 rounded-2xl py-4 items-center justify-center",
                    pressed ? "opacity-90" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  style={{ transform: [{ scale: pressed ? 0.99 : 1 }] }}
                >
                  <AppText className="text-[14px] font-semibold text-danger">Discard</AppText>
                </View>
              )}
            </Pressable>

            <View className="w-3" />

            <Button
              title={`Finish Workout${completed ? ` (${completed})` : ""}`}
              onPress={() => Alert.alert("Finish", "Workout finished")}
              className="flex-1 rounded-2xl"
            />
          </View>
        </ScrollView>
      </View>
    </Screen>
  );
}
