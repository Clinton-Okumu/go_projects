import { PropsWithChildren } from "react";
import { Text, TextProps } from "react-native";

type Variant = "title" | "subtitle" | "body" | "muted" | "link";

type Props = PropsWithChildren<
  TextProps & {
    variant?: Variant;
    className?: string;
  }
>;

const base = {
  title: "text-3xl font-bold text-app-text text-center",
  subtitle: "text-lg font-semibold text-app-text",
  body: "text-base text-app-text",
  muted: "text-sm text-app-muted",
  link: "text-base font-semibold text-brand",
} satisfies Record<Variant, string>;

export default function AppText({ variant = "body", className, ...props }: Props) {
  const cn = [base[variant], className].filter(Boolean).join(" ");
  return <Text {...props} className={cn} />;
}
