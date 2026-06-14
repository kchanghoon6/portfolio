import { ExternalLink, FileText } from "lucide-react"
import { GithubIcon } from "@/components/brand-icons"
import { SectionHeader } from "@/components/section-header"
import { Reveal } from "@/components/reveal"
import { publications } from "@/lib/portfolio-data"

const linkIcon = {
  github: GithubIcon,
  demo: ExternalLink,
  paper: FileText,
  writeup: ExternalLink,
} as const

export function Publications() {
  return (
    <section
      id="writing"
      aria-labelledby="writing-heading"
      className="border-t border-border/70 bg-muted/30"
    >
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <h2 id="writing-heading" className="sr-only">
          Publications and Writing
        </h2>
        <SectionHeader
          eyebrow="Writing"
          title="Publications & writing"
          description="Papers, preprints, and technical notes on perception and reproducible robotics."
        />
        <ul className="mt-12 space-y-4">
          {publications.map((pub, i) => (
            <Reveal as="li" key={pub.title} delay={i * 60}>
              <article className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex flex-col gap-x-4 gap-y-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <h3 className="text-base font-semibold tracking-tight">{pub.title}</h3>
                  <p className="shrink-0 font-mono text-xs text-muted-foreground">{pub.venue}</p>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{pub.authors}</p>
                <p className="mt-3 max-w-[70ch] text-sm leading-relaxed text-muted-foreground">
                  {pub.summary}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                  {pub.links.map((link) => {
                    const Icon = linkIcon[link.type]
                    return (
                      <a
                        key={link.label}
                        href={link.href}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        {link.label}
                      </a>
                    )
                  })}
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
