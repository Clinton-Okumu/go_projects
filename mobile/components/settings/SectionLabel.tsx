import AppText from "@/components/ui/AppText";

type Props = {
  title: string;
};

export default function SectionLabel({ title }: Props) {
  return (
    <AppText className="text-[10px] uppercase tracking-wider text-app-muted font-semibold">
      {title}
    </AppText>
  );
}
