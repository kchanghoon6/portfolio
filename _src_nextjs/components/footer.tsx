import { ArrowUp } from "lucide-react"
import { navLinks, profile } from "@/lib/portfolio-data"

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="font-mono text-sm font-semibold tracking-tight">
            {profile.name}
            <span className="text-brand">.</span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            © {year} · Built with Next.js & Tailwind CSS.
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#top"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
          >
            Back to top
            <ArrowUp className="h-4 w-4" aria-hidden="true" />
          </a>
        </nav>
      </div>
    </footer>
  )
}
