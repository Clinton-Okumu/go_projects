import { COLORS } from "@/constants/colors";
import { TextInput, TextInputProps } from "react-native";

type Props = TextInputProps & {
  error?: boolean;
  className?: string;
};

export default function TextField({ error, className, ...props }: Props) {
  const cn = [
    "bg-app-card rounded-2xl px-4 py-4 text-[15px] text-app-text border",
    error ? "border-danger" : "border-app-border",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <TextInput
      placeholderTextColor={COLORS.textLight}
      selectionColor={COLORS.primary}
      className={cn}
      {...props}
    />
  );
}
