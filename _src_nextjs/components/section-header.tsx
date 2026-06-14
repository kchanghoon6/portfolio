import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  /** Small mono kicker shown above the title */
  eyebrow?: string
  title: string
  description?: string
  className?: string
}

/** Consistent section heading used across every section. */
export function SectionHeader({ eyebrow, title, description, className }: SectionHeaderProps) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {eyebrow ? (
        <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.18em] text-brand">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-pretty text-3xl font-semibold tracking-tight sm:text-[2rem]">{title}</h2>
      {description ? (
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
    </div>
  )
}
