import { View } from "react-native";

type Props = {
  value: number;
  className?: string;
  trackClassName?: string;
  fillClassName?: string;
};

function clamp01(n: number) {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

export default function ProgressBar({
  value,
  className,
  trackClassName,
  fillClassName,
}: Props) {
  const v = clamp01(value);

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ now: Math.round(v * 100), min: 0, max: 100 }}
      className={["w-full", className].filter(Boolean).join(" ")}
    >
      <View
        className={[
          "h-2 rounded-full bg-app-border overflow-hidden",
          trackClassName,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <View
          className={["h-full bg-brand rounded-full", fillClassName]
            .filter(Boolean)
            .join(" ")}
          style={{ width: `${Math.round(v * 100)}%` }}
        />
      </View>
    </View>
  );
}
