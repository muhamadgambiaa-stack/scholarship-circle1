import { cx } from "@/lib/utils";

const tones = {
  navy: "bg-navy-50 text-navy-700 border-navy-200",
  gold: "bg-gold-500 text-navy-950 border-gold-500",
  outline: "bg-white text-navy-600 border-navy-200",
};

export default function Badge({
  children,
  tone = "navy",
}: {
  children: React.ReactNode;
  tone?: keyof typeof tones;
}) {
  return (
    <span className={cx("rounded-full border px-2.5 py-0.5 text-xs font-medium", tones[tone])}>
      {children}
    </span>
  );
}
