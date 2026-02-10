import { COLORS } from "@/constants/colors";
import { ActivityIndicator, TouchableOpacity, TouchableOpacityProps } from "react-native";
import AppText from "@/components/ui/AppText";

type Variant = "primary" | "ghost";

type Props = TouchableOpacityProps & {
  title: string;
  variant?: Variant;
  loading?: boolean;
  className?: string;
};

const container = {
  primary: "bg-brand rounded-2xl px-4 py-4 items-center shadow-sm",
  ghost: "bg-app-card border border-app-border rounded-2xl px-4 py-4 items-center",
} satisfies Record<Variant, string>;

const text = {
  primary: "text-white font-semibold text-[16px]",
  ghost: "text-brand font-semibold text-[16px]",
} satisfies Record<Variant, string>;

export default function Button({
  title,
  variant = "primary",
  loading,
  disabled,
  className,
  ...props
}: Props) {
  const isDisabled = Boolean(disabled || loading);

  return (
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={0.85}
      disabled={isDisabled}
      className={[
        container[variant],
        isDisabled ? "opacity-60" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? COLORS.white : COLORS.primary} />
      ) : null}
      {!loading ? <AppText className={text[variant]}>{title}</AppText> : null}
    </TouchableOpacity>
  );
}
