import ConsistencyGrid from "@/components/stats/ConsistencyGrid";
import PersonalRecordItem from "@/components/stats/PersonalRecordItem";
import StatCard from "@/components/stats/StatCard";
import WeeklyVolumeCard from "@/components/stats/WeeklyVolumeCard";
import AppText from "@/components/ui/AppText";
import Screen from "@/components/ui/Screen";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useMemo } from "react";
import { Pressable, ScrollView, View } from "react-native";

export default function StatsScreen() {
  const tabBarHeight = useBottomTabBarHeight();

  const bars = useMemo(
    () =>
      [
        { day: "M", value: 8_900 },
        { day: "T", value: 12_400 },
        { day: "W", value: 6_800 },
        { day: "T", value: 14_250 },
        { day: "F", value: 10_600 },
        { day: "S", value: 5_500 },
        { day: "S", value: 0 },
      ],
    []
  );

  const consistency = useMemo(
    () => [
      0.8, 0.5, 0.2, 0.6, 0.0, 0.3, 0.7, 0.1,
      0.9, 0.4, 0.2, 0.6, 0.8, 0.3, 0.0, 0.2,
      0.7, 0.5, 0.0, 0.3, 0.8, 0.4, 0.2, 0.9,
    ],
    []
  );

  return (
    <Screen className="px-4">
      <View className="flex-1">
        <View pointerEvents="none" className="absolute -top-24 -right-36 w-80 h-80 rounded-full bg-brand/10" />
        <View pointerEvents="none" className="absolute top-40 -left-44 w-72 h-72 rounded-full bg-brand/5" />

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: tabBarHeight + 20 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="pt-4">
            <View className="bg-brand/10 border border-brand/10 rounded-3xl p-4 overflow-hidden">
              <View pointerEvents="none" className="absolute -top-16 -right-20 w-56 h-56 rounded-full bg-white/50" />

              <View className="flex-row items-center justify-between">
                <View className="flex-1 pr-3">
                  <AppText className="text-[26px] font-bold text-app-text">Progress Stats</AppText>
                  <AppText className="mt-1 text-[12px] text-app-muted">Tracking your gains since January</AppText>
                </View>

                <Pressable
                  onPress={() => {}}
                  className="w-11 h-11 rounded-2xl bg-app-card border border-app-border items-center justify-center shadow-sm"
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel="Calendar"
                >
                  <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
                </Pressable>
              </View>
            </View>
          </View>

          <View className="mt-4 flex-row">
            <StatCard iconName="flame-outline" value="12" label="Day streak" />
            <View className="w-3" />
            <StatCard iconName="hammer-outline" value="48" label="Total sessions" />
          </View>

          <View className="mt-4">
            <WeeklyVolumeCard value="14,250" deltaLabel="+12% vs LW" bars={bars} />
          </View>

          <View className="mt-8 flex-row items-center justify-between">
            <AppText className="text-[14px] font-semibold text-app-text">Personal Records</AppText>
            <Pressable
              onPress={() => {}}
              className="px-3 py-1 rounded-full bg-app-card border border-app-border"
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="View all personal records"
            >
              <AppText className="text-[12px] font-semibold text-brand">View All</AppText>
            </Pressable>
          </View>

          <View className="mt-3">
            <PersonalRecordItem
              title="Bench Press"
              subtitle="Yesterday - New PR"
              value="225 lbs"
              delta="+10 lbs"
              iconName="flash-outline"
            />
            <View className="h-3" />
            <PersonalRecordItem
              title="Deadlift"
              subtitle="3 days ago"
              value="315 lbs"
              delta="Stable"
              iconName="trending-up-outline"
            />
          </View>

          <View className="mt-8">
            <ConsistencyGrid values={consistency} />
          </View>
        </ScrollView>
      </View>
    </Screen>
  );
}
