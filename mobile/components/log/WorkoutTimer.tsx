import AppText from "@/components/ui/AppText";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Pressable, View } from "react-native";

type Props = {
  initialSeconds?: number;
  mode?: "chip" | "inline";
  className?: string;
};

function pad2(n: number) {
  return String(Math.max(0, Math.floor(n))).padStart(2, "0");
}

function formatHms(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${pad2(h)}:${pad2(m)}:${pad2(sec)}`;
}

export default function WorkoutTimer({
  initialSeconds = 0,
  mode = "chip",
  className,
}: Props) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [running, setRunning] = useState(true);

  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (!running) {
      pulse.stopAnimation();
      pulse.setValue(1);
      return;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.35, duration: 650, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 650, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse, running]);

  const label = useMemo(() => formatHms(seconds), [seconds]);
  const minuteProgress = useMemo(() => (seconds % 60) / 60, [seconds]);

  const cn = [
    mode === "chip"
      ? "bg-app-card border border-app-border rounded-2xl px-3 py-2 overflow-hidden shadow-sm"
      : "px-2 py-1",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Pressable
      onPress={() => setRunning((v) => !v)}
      onLongPress={() => {
        setSeconds(0);
        setRunning(true);
      }}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={running ? "Pause timer" : "Resume timer"}
      className={cn}
    >
      <View className="flex-row items-center">
        <Animated.View style={{ opacity: pulse }} className="w-2 h-2 rounded-full bg-danger" />
        <View className="w-2" />

        <AppText
          className={[
            "text-[12px] font-semibold",
            mode === "chip" ? "text-app-text" : "text-brand",
          ].join(" ")}
          style={{ fontVariant: ["tabular-nums"] }}
        >
          {label}
        </AppText>

        <View className="w-2" />
        <Ionicons name={running ? "pause" : "play"} size={14} color={COLORS.textLight} />
      </View>

      <View
        className={[
          mode === "chip" ? "absolute left-0 right-0 bottom-0" : "mt-1",
          "h-0.5 bg-app-border",
        ].join(" ")}
      >
        <View className="h-0.5 bg-brand" style={{ width: `${Math.round(minuteProgress * 100)}%` }} />
      </View>
    </Pressable>
  );
}
