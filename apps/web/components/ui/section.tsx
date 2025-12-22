import { cn } from "@/lib/utils";

export default function Section({
  id,
  eyebrow,
  title,
  desc,
  children,
  className,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  desc?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("mx-auto max-w-6xl px-4 py-16", className)}>
      <div className="mb-10">
        {eyebrow && <div className="text-xs font-semibold tracking-widest opacity-70">{eyebrow}</div>}
        <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
        {desc && <div className="mt-3 max-w-2xl text-sm opacity-80">{desc}</div>}
      </div>
      {children}
    </section>
  );
}
