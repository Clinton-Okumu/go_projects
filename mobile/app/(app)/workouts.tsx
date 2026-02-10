import RoutineListItem from "@/components/workouts/RoutineListItem";
import SearchBar from "@/components/home/SearchBar";
import AppText from "@/components/ui/AppText";
import Screen from "@/components/ui/Screen";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

export default function WorkoutsScreen() {
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();
  const [query, setQuery] = useState("");

  const routines = useMemo(
    () =>
      [
        {
          title: "Push Day",
          subtitle: "Chest, Shoulders, Triceps",
          exerciseCount: 6,
          iconName: "barbell-outline" as const,
          iconBgClassName: "bg-brand/10",
          iconColor: COLORS.primary,
        },
        {
          title: "Pull Day",
          subtitle: "Back, Biceps, Rear Delts",
          exerciseCount: 7,
          iconName: "reorder-two-outline" as const,
          iconBgClassName: "bg-brand/10",
          iconColor: COLORS.primary,
        },
        {
          title: "Legs Day",
          subtitle: "Quads, Hams, Glutes, Calves",
          exerciseCount: 5,
          iconName: "walk-outline" as const,
          iconBgClassName: "bg-brand/10",
          iconColor: COLORS.primary,
        },
        {
          title: "Full Body",
          subtitle: "Hypertrophy Focus",
          exerciseCount: 8,
          iconName: "flash-outline" as const,
          iconBgClassName: "bg-brand/10",
          iconColor: COLORS.primary,
        },
      ].filter((r) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return `${r.title} ${r.subtitle}`.toLowerCase().includes(q);
      }),
    [query]
  );

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
          contentContainerStyle={{ paddingBottom: tabBarHeight + 20 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="pt-4">
            <View className="bg-brand/10 border border-brand/10 rounded-3xl p-4 overflow-hidden">
              <View pointerEvents="none" className="absolute -top-16 -right-20 w-56 h-56 rounded-full bg-white/50" />

              <View className="flex-row items-center justify-between">
                <View className="px-3 py-1 rounded-full bg-app-card border border-app-border">
                  <AppText className="text-[11px] uppercase tracking-wider text-app-muted font-semibold">
                    Workouts & Routines
                  </AppText>
                </View>

                <View className="px-3 py-1 rounded-full bg-app-card border border-app-border">
                  <AppText className="text-[11px] font-semibold text-app-text">
                    {routines.length} routines
                  </AppText>
                </View>
              </View>

              <View className="mt-4 flex-row items-center justify-between">
                <View className="flex-1 pr-3">
                  <AppText className="text-[26px] font-bold text-app-text">Workouts</AppText>
                  <AppText className="mt-1 text-[12px] text-app-muted">
                    Select a routine to start
                  </AppText>
                </View>

                <Pressable
                  onPress={() => router.push("/(app)/log")}
                  className="w-11 h-11 rounded-2xl bg-app-card border border-app-border items-center justify-center shadow-sm"
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel="Create new routine"
                >
                  <Ionicons name="add" size={22} color={COLORS.primary} />
                </Pressable>
              </View>
            </View>
          </View>

          <SearchBar
            value={query}
            onChangeText={setQuery}
            placeholder="Search routines..."
            className="mt-4"
          />

          <View className="mt-4">
            {routines.length === 0 ? (
              <View className="bg-app-card border border-app-border rounded-2xl px-4 py-4 shadow-sm">
                <AppText className="text-[14px] font-semibold text-app-text">
                  No routines found
                </AppText>
                <AppText className="mt-1 text-[12px] text-app-muted">
                  Try a different search, or create a new routine.
                </AppText>
              </View>
            ) : (
              routines.map((r) => (
                <View key={r.title} className="mb-3">
                  <RoutineListItem
                    title={r.title}
                    subtitle={r.subtitle}
                    exerciseCount={r.exerciseCount}
                    iconName={r.iconName}
                    iconBgClassName={r.iconBgClassName}
                    iconColor={r.iconColor}
                    onPress={() => router.push("/(app)/workouts")}
                  />
                </View>
              ))
            )}
          </View>

          <Pressable
            onPress={() => router.push("/(app)/log")}
            accessibilityRole="button"
            accessibilityLabel="Create new routine"
            className="mt-2 mb-2"
          >
            {({ pressed }) => (
              <View
                className={[
                  "border border-dashed border-brand/50 bg-brand/5 rounded-2xl py-3 items-center justify-center flex-row",
                  pressed ? "opacity-90" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <View className="w-8 h-8 rounded-full bg-app-card border border-app-border items-center justify-center">
                  <Ionicons name="add" size={18} color={COLORS.primary} />
                </View>
                <AppText className="ml-2 text-[13px] font-semibold text-brand">
                  Create New Routine
                </AppText>
              </View>
            )}
          </Pressable>
        </ScrollView>
      </View>
    </Screen>
  );
}
