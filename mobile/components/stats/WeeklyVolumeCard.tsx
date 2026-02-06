import AppText from "@/components/ui/AppText";
import { View } from "react-native";

type Props = {
  title?: string;
  subtitle?: string;
  value: string;
  deltaLabel: string;
  bars: { day: string; value: number }[];
};

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

export default function WeeklyVolumeCard({
  title = "Weekly Volume",
  subtitle = "Total lbs lifted",
  value,
  deltaLabel,
  bars,
}: Props) {
  const max = Math.max(1, ...bars.map((b) => b.value));

  return (
    <View className="bg-app-card border border-app-border rounded-3xl p-4 shadow-sm overflow-hidden">
      <View pointerEvents="none" className="absolute -top-16 -right-20 w-56 h-56 rounded-full bg-brand/10" />

      <View className="flex-row items-start justify-between">
        <View>
          <AppText className="text-[14px] font-semibold text-app-text">{title}</AppText>
          <AppText className="mt-1 text-[11px] text-app-muted">{subtitle}</AppText>
        </View>

        <View className="items-end">
          <AppText className="text-[13px] font-bold text-brand">{value}</AppText>
          <AppText className="mt-1 text-[11px] text-success font-semibold">{deltaLabel}</AppText>
        </View>
      </View>

      <View className="mt-4 flex-row items-end justify-between">
        {bars.map((b, idx) => {
          const h = clamp01(b.value / max);
          const isHighlight = idx === 3;
          return (
            <View
              key={`${b.day}-${idx}`}
              className="items-center"
              style={{ width: `${100 / bars.length}%` }}
            >
              <View
                className={[
                  "w-5 rounded-xl",
                  isHighlight ? "bg-brand" : "bg-brand/30",
                ].join(" ")}
                style={{ height: 90 * h + 18 }}
              />
              <AppText className="mt-2 text-[10px] text-app-muted font-semibold">
                {b.day}
              </AppText>
            </View>
          );
        })}
      </View>
    </View>
  );
}
