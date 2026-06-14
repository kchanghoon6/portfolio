import { SectionHeader } from "@/components/section-header"
import { Reveal } from "@/components/reveal"
import { experience, type ExperienceItem } from "@/lib/portfolio-data"

function TimelineItem({ item }: { item: ExperienceItem }) {
  return (
    <div className="relative pl-8">
      {/* dot */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-1.5 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-brand bg-background"
      />
      <div className="flex flex-col gap-x-3 gap-y-1 sm:flex-row sm:items-baseline sm:justify-between">
        <h3 className="text-base font-semibold tracking-tight">
          {item.role} <span className="text-muted-foreground">· {item.org}</span>
        </h3>
        <p className="shrink-0 font-mono text-xs text-muted-foreground">{item.dates}</p>
      </div>
      <p className="mt-0.5 font-mono text-xs text-muted-foreground">{item.location}</p>
      <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-muted-foreground">
        {item.bullets.map((b, i) => (
          <li key={i} className="relative pl-4 before:absolute before:left-0 before:top-2.5 before:h-1 before:w-1 before:rounded-full before:bg-muted-foreground/50">
            {b}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-heading" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
      <h2 id="experience-heading" className="sr-only">
        Experience
      </h2>
      <SectionHeader eyebrow="Experience" title="Where I’ve worked" />
      <ol className="relative mt-12 space-y-12 border-l border-border pl-1">
        {experience.map((item, i) => (
          <Reveal as="li" key={`${item.role}-${item.org}`} delay={i * 50}>
            <TimelineItem item={item} />
          </Reveal>
        ))}
      </ol>
    </section>
  )
}
