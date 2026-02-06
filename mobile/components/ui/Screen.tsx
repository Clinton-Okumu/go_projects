import { PropsWithChildren } from "react";
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
  const cn = ["flex-1 bg-app-bg", className].filter(Boolean).join(" ");
  return (
    <SafeAreaView edges={edges as Edge[]} className={cn}>
      {children}
    </SafeAreaView>
  );
}
