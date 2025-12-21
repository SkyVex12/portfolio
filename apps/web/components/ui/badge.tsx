import { cn } from "@/lib/utils";

export default function Badge({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-black/10 bg-black/5 px-3 py-1 text-xs font-medium dark:border-white/10 dark:bg-white/10",
        className
      )}
    >
      {children}
    </span>
  );
}
