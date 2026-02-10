import HomeHeader from "@/components/home/HomeHeader";
import QuickStatCard from "@/components/home/QuickStatCard";
import RecentActivityItem from "@/components/home/RecentActivityItem";
import ResumeTrainingCard from "@/components/home/ResumeTrainingCard";
import SearchBar from "@/components/home/SearchBar";
import AppText from "@/components/ui/AppText";
import Screen from "@/components/ui/Screen";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function HomeScreen() {
  const { user } = useUser();
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();
  const [query, setQuery] = useState("");

  const name =
    user?.firstName ||
    user?.username ||
    user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] ||
    "there";

  return (
    <Screen className="px-4">
      <View className="flex-1">
        <View
          pointerEvents="none"
          className="absolute -top-24 -right-32 w-80 h-80 rounded-full bg-brand/10"
        />
        <View
          pointerEvents="none"
          className="absolute top-32 -left-40 w-72 h-72 rounded-full bg-brand/5"
        />

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: tabBarHeight + 20 }}
          showsVerticalScrollIndicator={false}
        >
          <HomeHeader
            overline={getGreeting()}
            name={name}
            avatarUri={user?.imageUrl}
            onPressAvatar={() => router.push("/(app)/settings")}
            onPressNotifications={() => router.push("/(app)/log")}
          />

          <SearchBar
            value={query}
            onChangeText={setQuery}
            className="mt-5"
            onSubmit={() => {
              // Placeholder behavior until the search screen exists.
              router.push("/(app)/workouts");
            }}
          />

          <View className="mt-7 flex-row items-center justify-between">
            <AppText className="text-[16px] font-semibold text-app-text">Resume Training</AppText>
            <Pressable
              onPress={() => router.push("/(app)/workouts")}
              className="px-3 py-1 rounded-full bg-brand/5 border border-brand/20"
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="View plan"
            >
              <AppText className="text-[12px] font-semibold text-brand">View Plan</AppText>
            </Pressable>
          </View>

          <View className="mt-3">
            <ResumeTrainingCard
              title="Upper Body Strength - Day 2"
              durationMins={45}
              exerciseCount={8}
              progress={0.6}
              imageSource={require("../../assets/images/img1.png")}
              statusLabel="In progress"
              onContinue={() => router.push("/(app)/workouts")}
            />
          </View>

          <View className="mt-8">
            <AppText className="text-[16px] font-semibold text-app-text">Quick Stats</AppText>

            <View className="mt-3 flex-row">
              <QuickStatCard iconName="flame-outline" value="12 days" label="Current streak" />
              <View className="w-3" />
              <QuickStatCard iconName="calendar-outline" value="3" label="Workouts this week" />
            </View>
          </View>

          <View className="mt-8 flex-row items-center justify-between">
            <AppText className="text-[16px] font-semibold text-app-text">Recent Activity</AppText>
            <Pressable
              onPress={() => router.push("/(app)/log")}
              className="px-3 py-1 rounded-full bg-brand/5 border border-brand/20"
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="View history"
            >
              <AppText className="text-[12px] font-semibold text-brand">View History</AppText>
            </Pressable>
          </View>

          <View className="mt-3">
            <RecentActivityItem
              title="Leg Day - Hypertrophy"
              when="Yesterday"
              duration="55m"
              metric="12,500 lbs"
              iconName="flash-outline"
              onPress={() => router.push("/(app)/log")}
            />
            <View className="h-3" />
            <RecentActivityItem
              title="Core & HIIT"
              when="2 days ago"
              duration="35m"
              metric="420 kcal"
              iconName="heart-outline"
              onPress={() => router.push("/(app)/log")}
            />
            <View className="h-3" />
            <RecentActivityItem
              title="Pull Day - Back"
              when="4 days ago"
              duration="62m"
              metric="9,800 lbs"
              iconName="barbell-outline"
              onPress={() => router.push("/(app)/log")}
            />
          </View>
        </ScrollView>
      </View>
    </Screen>
  );
}
