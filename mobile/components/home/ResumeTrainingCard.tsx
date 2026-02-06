import AppText from "@/components/ui/AppText";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Image, ImageSourcePropType, View } from "react-native";

type Props = {
  title: string;
  durationMins: number;
  exerciseCount: number;
  progress: number; // 0..1
  imageSource: ImageSourcePropType;
  statusLabel?: string;
  onContinue?: () => void;
};

export default function ResumeTrainingCard({
  title,
  durationMins,
  exerciseCount,
  progress,
  imageSource,
  statusLabel = "In progress",
  onContinue,
}: Props) {
  const pct = Math.round(Math.max(0, Math.min(1, progress)) * 100);

  return (
    <View className="bg-app-card rounded-3xl border border-app-border shadow-md overflow-hidden">
      <View className="relative">
        <Image source={imageSource} className="w-full h-36" resizeMode="cover" />
        <View className="absolute inset-0 bg-black/10" />
        <View className="absolute left-3 bottom-3 bg-black/55 px-2.5 py-1 rounded-full border border-white/10">
          <AppText className="text-white text-[10px] uppercase tracking-wider font-semibold">
            {statusLabel}
          </AppText>
        </View>
        <View className="absolute right-3 top-3 bg-white/80 px-2.5 py-1 rounded-full">
          <AppText className="text-[11px] font-semibold text-app-text">{pct}%</AppText>
        </View>
      </View>

      <View className="p-4">
        <AppText className="text-[17px] font-semibold text-app-text">{title}</AppText>

        <View className="flex-row items-center mt-2">
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={14} color={COLORS.textLight} />
            <AppText className="ml-1 text-[12px] text-app-muted">
              {durationMins} mins
            </AppText>
          </View>

          <View className="w-4" />

          <View className="flex-row items-center">
            <Ionicons name="barbell-outline" size={14} color={COLORS.textLight} />
            <AppText className="ml-1 text-[12px] text-app-muted">
              {exerciseCount} exercises
            </AppText>
          </View>
        </View>

        <View className="flex-row items-center justify-between mt-4">
          <AppText className="text-[11px] uppercase tracking-wider text-app-muted font-semibold">
            Progress
          </AppText>
          <AppText className="text-[11px] text-app-muted font-semibold">{pct}%</AppText>
        </View>

        <View className="mt-2">
          <ProgressBar value={progress} />
        </View>

        <View className="mt-4">
          <Button
            title="Continue Workout"
            onPress={onContinue}
            className="w-full rounded-2xl py-3"
          />
        </View>
      </View>
    </View>
  );
}
