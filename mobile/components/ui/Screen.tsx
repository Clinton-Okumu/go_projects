import { PropsWithChildren, useEffect, useRef } from "react";
import { Animated } from "react-native";
import { Edge, SafeAreaView } from "react-native-safe-area-context";

type Props = PropsWithChildren<{
  className?: string;
  edges?: readonly Edge[];
}>;

export default function Screen({
  children,
  className,
  edges = ["top", "left", "right"],
}: Props) {
  const fade = useRef(new Animated.Value(0)).current;
  const translate = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }),
      Animated.timing(translate, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fade, translate]);

  const cn = ["flex-1 bg-app-bg", className].filter(Boolean).join(" ");
  return (
    <SafeAreaView edges={edges as Edge[]} className={cn}>
      <Animated.View style={{ flex: 1, opacity: fade, transform: [{ translateY: translate }] }}>
        {children}
      </Animated.View>
    </SafeAreaView>
  );
}
