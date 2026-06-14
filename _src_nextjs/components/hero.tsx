import { ArrowDown, Download } from "lucide-react"
import { GithubIcon } from "@/components/brand-icons"
import { profile } from "@/lib/portfolio-data"

export function Hero() {
  return (
    <section
      id="top"
      aria-label="Introduction"
      className="relative overflow-hidden"
    >
      {/* Faint background wash — subtle, decorative only */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 15% 0%, color-mix(in oklch, var(--brand) 10%, transparent), transparent 70%)",
        }}
      />
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-36 sm:px-6 sm:pt-40 lg:pb-28 lg:pt-48">
        <div className="max-w-3xl">
          <p className="font-mono text-sm tracking-tight text-brand">{profile.role}</p>
          <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            {profile.name}
          </h1>
          <p className="mt-6 max-w-2xl text-balance text-xl font-medium leading-snug text-foreground/90 sm:text-2xl">
            {profile.headline}
          </p>
          <p className="mt-4 max-w-[60ch] text-base leading-relaxed text-muted-foreground">
            {profile.subtext}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              View Projects
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href={profile.resumeHref}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Download Resume
            </a>
            <a
              href={profile.githubHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <GithubIcon className="h-4 w-4" aria-hidden="true" />
              GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
