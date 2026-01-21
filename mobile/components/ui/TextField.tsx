import { TextInput, TextInputProps } from "react-native";

type Props = TextInputProps & {
  error?: boolean;
  className?: string;
};

export default function TextField({ error, className, ...props }: Props) {
  const cn = [
    "bg-white rounded-xl px-4 py-4 text-base text-app-text border",
    error ? "border-danger" : "border-app-border",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <TextInput placeholderTextColor="#9A8478" className={cn} {...props} />;
}
