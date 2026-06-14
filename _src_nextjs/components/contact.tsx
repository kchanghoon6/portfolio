import { GraduationCap, Mail } from "lucide-react"
import { GithubIcon, LinkedinIcon } from "@/components/brand-icons"
import { SectionHeader } from "@/components/section-header"
import { Reveal } from "@/components/reveal"
import { socialLinks } from "@/lib/portfolio-data"

const socialIcon = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  mail: Mail,
  scholar: GraduationCap,
} as const

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="border-t border-border/70 bg-muted/30"
    >
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <h2 id="contact-heading" className="sr-only">
          Contact
        </h2>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow="Contact"
              title="Let’s talk"
              description="I’m open to research collaborations, internships, and conversations about robotics and applied ML. The fastest way to reach me is email."
            />
          </div>
          <Reveal className="lg:col-span-7">
            <ul className="grid gap-3 sm:grid-cols-2">
              {socialLinks.map((link) => {
                const Icon = socialIcon[link.icon]
                const external = link.href.startsWith("http")
                return (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-foreground transition-colors group-hover:text-brand">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="text-sm font-medium">{link.label}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
