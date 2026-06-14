import { SectionHeader } from "@/components/section-header"
import { Reveal } from "@/components/reveal"
import { aboutParagraphs } from "@/lib/portfolio-data"

export function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 id="about-heading" className="sr-only">
            About
          </h2>
          <SectionHeader eyebrow="About" title="A bit about me" />
        </div>
        <Reveal className="lg:col-span-8">
          <div className="max-w-[68ch] space-y-5 text-base leading-relaxed text-muted-foreground">
            {aboutParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
