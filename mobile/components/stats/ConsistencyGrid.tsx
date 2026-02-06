import AppText from "@/components/ui/AppText";
import { View } from "react-native";

type Props = {
  title?: string;
  rows?: number;
  cols?: number;
  values: number[]; // 0..1 per cell
};

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

function cellClass(v: number) {
  const x = clamp01(v);
  if (x === 0) return "bg-app-border/30";
  if (x < 0.34) return "bg-brand/25";
  if (x < 0.67) return "bg-brand/50";
  return "bg-brand";
}

export default function ConsistencyGrid({ title = "Monthly Consistency", rows = 3, cols = 8, values }: Props) {
  const needed = rows * cols;
  const normalized = values.length >= needed ? values.slice(0, needed) : values.concat(Array(needed - values.length).fill(0));

  return (
    <View>
      <AppText className="text-[14px] font-semibold text-app-text">{title}</AppText>

      <View className="mt-3 bg-app-card border border-app-border rounded-3xl p-4 shadow-sm">
        <View className="flex-row flex-wrap" style={{ gap: 8 }}>
          {normalized.map((v, i) => (
            <View
              key={i}
              className={["w-7 h-7 rounded-lg", cellClass(v)].join(" ")}
            />
          ))}
        </View>
      </View>
    </View>
  );
}
