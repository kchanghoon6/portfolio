import { SectionHeader } from "@/components/section-header"
import { Reveal } from "@/components/reveal"
import { researchInterests } from "@/lib/portfolio-data"

export function ResearchInterests() {
  return (
    <section
      id="research"
      aria-labelledby="research-heading"
      className="border-t border-border/70 bg-muted/30"
    >
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <h2 id="research-heading" className="sr-only">
          Research Interests
        </h2>
        <SectionHeader
          eyebrow="Research"
          title="Research interests"
          description="The threads that run through most of my work, from perception to deployment."
        />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2">
          {researchInterests.map((interest, i) => (
            <Reveal as="li" key={interest.title} delay={i * 60}>
              <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-base font-semibold tracking-tight">{interest.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {interest.description}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
