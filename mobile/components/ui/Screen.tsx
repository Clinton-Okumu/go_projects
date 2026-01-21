import { PropsWithChildren } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = PropsWithChildren<{
  className?: string;
}>;

export default function Screen({ children, className }: Props) {
  const cn = ["flex-1 bg-app-bg", className].filter(Boolean).join(" ");
  return <SafeAreaView className={cn}>{children}</SafeAreaView>;
}
