import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { ResearchInterests } from "@/components/research-interests"
import { ProjectsSection } from "@/components/projects-section"
import { Skills } from "@/components/skills"
import { Experience } from "@/components/experience"
import { Publications } from "@/components/publications"
import { Awards } from "@/components/awards"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <ResearchInterests />
        <ProjectsSection />
        <Skills />
        <Experience />
        <Publications />
        <Awards />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
