"use client"

import { useMemo, useState } from "react"
import { SectionHeader } from "@/components/section-header"
import { Reveal } from "@/components/reveal"
import { FeaturedProjectCard, ProjectCard } from "@/components/project-card"
import { projects } from "@/lib/portfolio-data"
import { cn } from "@/lib/utils"

export function ProjectsSection() {
  const featured = projects.filter((p) => p.featured)
  const all = projects

  const tags = useMemo(() => {
    const set = new Set<string>()
    all.forEach((p) => p.tags.forEach((t) => set.add(t)))
    return ["All", ...Array.from(set).sort()]
  }, [all])

  const [filter, setFilter] = useState("All")
  const filtered = filter === "All" ? all : all.filter((p) => p.tags.includes(filter))

  return (
    <section id="projects" aria-labelledby="projects-heading" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
      <h2 id="projects-heading" className="sr-only">
        Projects
      </h2>

      {/* Featured */}
      <SectionHeader
        eyebrow="Selected work"
        title="Featured projects"
        description="A few projects I’m most proud of, spanning robotics, perception, and embedded ML."
      />
      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {featured.map((project, i) => (
          <Reveal key={project.title} delay={i * 70}>
            <FeaturedProjectCard project={project} />
          </Reveal>
        ))}
      </div>

      {/* All projects with tag filter */}
      <div className="mt-20">
        <SectionHeader eyebrow="Archive" title="All projects" />
        <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter projects by tag">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setFilter(tag)}
              aria-pressed={filter === tag}
              className={cn(
                "rounded-full border px-3 py-1 font-mono text-xs tracking-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                filter === tag
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30",
              )}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
        {filtered.length === 0 ? (
          <p className="mt-8 text-sm text-muted-foreground">No projects match this filter.</p>
        ) : null}
      </div>
    </section>
  )
}
