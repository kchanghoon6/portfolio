import { ArrowUpRight, ExternalLink, FileText, Play } from "lucide-react"
import { GithubIcon } from "@/components/brand-icons"
import type { Project, ProjectLink } from "@/lib/portfolio-data"
import { cn } from "@/lib/utils"

const linkIcon = {
  github: GithubIcon,
  demo: Play,
  paper: FileText,
  writeup: ExternalLink,
} as const

function ProjectLinks({ links }: { links: ProjectLink[] }) {
  if (!links.length) return null
  return (
    <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
      {links.map((link) => {
        const Icon = linkIcon[link.type]
        return (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {link.label}
          </a>
        )
      })}
    </div>
  )
}

function Tags({ tags }: { tags: string[] }) {
  return (
    <ul className="mt-4 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <li
          key={tag}
          className="rounded-full border border-border bg-muted/60 px-2.5 py-0.5 font-mono text-[11px] tracking-tight text-muted-foreground"
        >
          {tag}
        </li>
      ))}
    </ul>
  )
}

/** Larger card used in the Featured Projects section. */
export function FeaturedProjectCard({ project }: { project: Project }) {
  return (
    <article className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-brand/40 hover:shadow-md sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold tracking-tight">{project.title}</h3>
        <ArrowUpRight
          className="h-5 w-5 shrink-0 text-muted-foreground/50 transition-colors group-hover:text-brand"
          aria-hidden="true"
        />
      </div>
      <p className="mt-2 text-sm font-medium text-brand">{project.impact}</p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{project.description}</p>
      <Tags tags={project.tags} />
      <ProjectLinks links={project.links} />
    </article>
  )
}

/** Compact card used in the All Projects grid. */
export function ProjectCard({ project, className }: { project: Project; className?: string }) {
  return (
    <article
      className={cn(
        "group flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-brand/40 hover:shadow-md",
        className,
      )}
    >
      <h3 className="text-base font-semibold tracking-tight">{project.title}</h3>
      <p className="mt-1.5 text-sm font-medium text-brand">{project.impact}</p>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{project.description}</p>
      <Tags tags={project.tags} />
      <ProjectLinks links={project.links} />
    </article>
  )
}
