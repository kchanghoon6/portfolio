import { SectionHeader } from "@/components/section-header"
import { Reveal } from "@/components/reveal"
import { skillGroups } from "@/lib/portfolio-data"

export function Skills() {
  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="border-t border-border/70 bg-muted/30"
    >
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <h2 id="skills-heading" className="sr-only">
          Technical Skills
        </h2>
        <SectionHeader
          eyebrow="Skills"
          title="Technical skills"
          description="Tools I reach for across the perception, learning, and deployment stack."
        />
        <dl className="mt-12 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group, i) => (
            <Reveal key={group.category} delay={i * 50}>
              <dt className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                {group.category}
              </dt>
              <dd className="mt-3">
                <ul className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <li
                      key={skill}
                      className="rounded-full border border-border bg-card px-3 py-1 font-mono text-[13px] text-foreground/90 shadow-sm"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  )
}
