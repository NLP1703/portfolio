import { lazy, useEffect } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Footer } from './components/Footer'
import { Navbar } from './components/Navbar'
import { Scene3D } from './components/Scene3D'
import { sectionTitles, type SectionId } from './data/site'
import { useActiveSection } from './hooks/useActiveSection'
import { useScrollMotion } from './hooks/useScrollMotion'
import { useTheme } from './hooks/useTheme'
import { About } from './sections/About'
import { Contact } from './sections/Contact'
import { Experience } from './sections/Experience'
import { Hero } from './sections/Hero'
import { Projects } from './sections/Projects'
import { Skills } from './sections/Skills'

const StarField = lazy(() => import('./three/StarField'))

const SECTION_IDS: readonly SectionId[] = [
  'accueil',
  'a-propos',
  'competences',
  'projets',
  'experiences',
  'contact',
]

export default function App() {
  const { theme, toggle } = useTheme()
  const active = useActiveSection(SECTION_IDS, 'accueil')
  const scrolled = useScrollMotion()
  const reduce = useReducedMotion()

  useEffect(() => {
    document.title = sectionTitles[active]
  }, [active])

  return (
    <>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-4 focus:z-[60] focus:rounded-control focus:bg-accent focus:px-4 focus:py-2 focus:font-mono focus:text-caption focus:text-bg-primary"
      >
        Aller au contenu
      </a>

      {/* Fond étoilé fixe, derrière tout le contenu. */}
      <Scene3D className="fixed inset-0 -z-10">
        <StarField animate={!reduce} />
      </Scene3D>

      <Navbar active={active} theme={theme} onToggleTheme={toggle} scrolled={scrolled} />

      <main id="contenu">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>

      <Footer />
    </>
  )
}
