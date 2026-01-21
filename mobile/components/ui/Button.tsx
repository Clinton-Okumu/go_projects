import { ActivityIndicator, TouchableOpacity, TouchableOpacityProps } from "react-native";
import AppText from "@/components/ui/AppText";

type Variant = "primary" | "ghost";

type Props = TouchableOpacityProps & {
  title: string;
  variant?: Variant;
  loading?: boolean;
};

const container = {
  primary: "bg-brand rounded-xl px-4 py-4 items-center",
  ghost: "rounded-xl px-4 py-4 items-center",
} satisfies Record<Variant, string>;

const text = {
  primary: "text-white font-semibold text-lg",
  ghost: "text-brand font-semibold text-lg",
} satisfies Record<Variant, string>;

export default function Button({ title, variant = "primary", loading, disabled, ...props }: Props) {
  const isDisabled = Boolean(disabled || loading);

  return (
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={0.85}
      disabled={isDisabled}
      className={[container[variant], isDisabled ? "opacity-60" : ""].join(" ")}
      {...props}
    >
      {loading ? <ActivityIndicator color="#FFFFFF" /> : null}
      {!loading ? <AppText className={text[variant]}>{title}</AppText> : null}
    </TouchableOpacity>
  );
}
