import { Award as AwardIcon } from "lucide-react"
import { SectionHeader } from "@/components/section-header"
import { Reveal } from "@/components/reveal"
import { awards } from "@/lib/portfolio-data"

export function Awards() {
  return (
    <section id="awards" aria-labelledby="awards-heading" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
      <h2 id="awards-heading" className="sr-only">
        Awards and Certifications
      </h2>
      <SectionHeader eyebrow="Recognition" title="Awards & certifications" />
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {awards.map((award, i) => (
          <Reveal as="li" key={award.title} delay={i * 60}>
            <div className="flex h-full items-start gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm">
              <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted text-brand">
                <AwardIcon className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-sm font-semibold tracking-tight">{award.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{award.issuer}</p>
                <p className="mt-0.5 font-mono text-xs text-muted-foreground">{award.year}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}
