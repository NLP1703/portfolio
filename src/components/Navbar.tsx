import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { FiMenu, FiX } from 'react-icons/fi'
import { navSections, site, type SectionId } from '../data/site'
import { ThemeToggle } from './ThemeToggle'
import type { Theme } from '../hooks/useTheme'

type Props = {
  active: SectionId
  theme: Theme
  onToggleTheme: () => void
  /** Vrai dès que le hero est quitté : la barre gagne son fond et sa bordure. */
  scrolled: boolean
}

/** Entrée de la barre : chaque lien démarre 80ms après le précédent. */
const LINK_STEP = 80
const LINK_OFFSET = 100
const CLUSTER_DELAY = 500

/**
 * Progression de lecture de la page, en fil d'accent sous la barre. Le
 * ressort absorbe les à-coups de la molette ; sous mouvement réduit la barre
 * suit le défilement brut.
 */
function ReadingProgress() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 })

  return (
    <motion.span
      aria-hidden="true"
      className="absolute inset-x-0 -bottom-px block h-[2px] origin-left bg-accent"
      style={{ scaleX: reduce ? scrollYProgress : smooth }}
    />
  )
}

type Indicator = { left: number; width: number; visible: boolean }

/**
 * Position du lien actif dans la liste. Un seul trait glisse d'un lien à
 * l'autre : le regard suit le déplacement au lieu de voir un trait
 * s'éteindre ici et un autre s'allumer là.
 */
function useActiveIndicator(active: SectionId) {
  const listRef = useRef<HTMLUListElement>(null)
  const [indicator, setIndicator] = useState<Indicator>({ left: 0, width: 0, visible: false })

  useLayoutEffect(() => {
    const list = listRef.current
    if (!list) return

    const measure = () => {
      const link = list.querySelector<HTMLElement>('[aria-current="true"]')
      // Hors navigation (hero) : le trait s'efface sur place, prêt à repartir de là.
      if (!link) {
        setIndicator((previous) => ({ ...previous, visible: false }))
        return
      }
      const origin = list.getBoundingClientRect().left
      const rect = link.getBoundingClientRect()
      setIndicator({ left: rect.left - origin, width: rect.width, visible: true })
    }

    measure()
    // Le chargement des polices et le redimensionnement déplacent les liens.
    const observer = new ResizeObserver(measure)
    observer.observe(list)
    return () => observer.disconnect()
  }, [active])

  return { listRef, indicator }
}

export function Navbar({ active, theme, onToggleTheme, scrolled }: Props) {
  const [open, setOpen] = useState(false)
  const [entered, setEntered] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const { listRef, indicator } = useActiveIndicator(active)

  // La barre ne se pose qu'une fois la page installée.
  useEffect(() => {
    const timer = window.setTimeout(() => setEntered(true), 200)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.querySelector<HTMLAnchorElement>('a')?.focus()

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      toggleRef.current?.focus()
    }
  }, [open])

  const entrance = (delay: number) => ({
    opacity: entered ? 1 : 0,
    transform: entered ? 'translateY(0)' : 'translateY(-12px)',
    transition: 'opacity 0.6s var(--ease-cinematic), transform 0.6s var(--ease-cinematic)',
    transitionDelay: `${delay}ms`,
  })

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur-[12px] ${
          scrolled ? 'border-hairline bg-[var(--nav-bg)]' : 'border-transparent bg-transparent'
        }`}
        style={{
          transitionProperty: 'background-color, border-color',
          transitionDuration: '500ms',
          transitionTimingFunction: 'var(--ease-overlay)',
        }}
      >
        <nav
          aria-label="Navigation principale"
          className="container-page flex h-[72px] items-center justify-between"
        >
          <a
            href="#accueil"
            className="font-mono text-lg font-bold tracking-tight text-ink-primary transition-colors duration-200 hover:text-accent"
            aria-label={`${site.name}, retour en haut de page`}
            style={entrance(0)}
          >
            {site.monogram}
          </a>

          <ul ref={listRef} className="relative hidden items-center gap-5 sm:flex lg:gap-8">
            {navSections.map(({ id, label }, index) => {
              const isActive = active === id
              return (
                <li key={id} style={entrance(index * LINK_STEP + LINK_OFFSET)}>
                  <a
                    href={`#${id}`}
                    aria-current={isActive ? 'true' : undefined}
                    className={`block py-2 text-caption font-medium transition-colors duration-200 hover:text-accent ${
                      isActive ? 'text-accent' : 'text-ink-secondary'
                    }`}
                  >
                    {label}
                  </a>
                </li>
              )
            })}
            {/* Largeur de base 1px, étirée par scaleX : le glissement reste sur le compositeur. */}
            <span
              aria-hidden="true"
              className="absolute -bottom-0.5 left-0 block h-[2px] w-px origin-left bg-accent"
              style={{
                opacity: indicator.visible ? 1 : 0,
                transform: `translateX(${indicator.left}px) scaleX(${indicator.visible ? indicator.width : 0})`,
                transition: 'transform 0.6s var(--ease-cinematic), opacity 0.3s var(--ease-overlay)',
              }}
            />
          </ul>

          <div className="flex items-center gap-3" style={entrance(CLUSTER_DELAY)}>
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
              className="grid h-10 w-10 place-items-center rounded-control border border-hairline text-ink-secondary transition-colors duration-200 hover:border-accent hover:text-accent sm:hidden"
            >
              {open ? <FiX size={18} aria-hidden="true" /> : <FiMenu size={18} aria-hidden="true" />}
            </button>
          </div>
        </nav>

        <ReadingProgress />
      </header>

      {/*
       * Le panneau reste monté : l'ouverture et la fermeture jouent sur
       * l'opacité et la visibilité, ce qui évite le à-coup d'un montage et
       * laisse la séquence des liens se rejouer à chaque ouverture.
       * `visibility: hidden` sort aussi le menu fermé de l'ordre de tabulation.
       */}
      <div
        aria-hidden={!open}
        className={`fixed inset-0 z-[100] sm:hidden ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
        style={{
          transitionProperty: 'opacity, visibility',
          transitionDuration: '500ms',
          transitionTimingFunction: 'var(--ease-overlay)',
        }}
      >
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={() => setOpen(false)}
          className="absolute inset-0 h-full w-full cursor-default bg-[var(--overlay)]"
        />

        <div
          id="menu-mobile"
          ref={panelRef}
          className="absolute bottom-0 right-0 top-0 w-72 max-w-[80vw] border-l border-hairline bg-bg-primary px-6 pb-8 pt-[88px]"
          style={{
            transform: open ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 500ms var(--ease-overlay)',
          }}
        >
          <ul className="flex flex-col gap-1">
            {navSections.map(({ id, label }, index) => {
              const isActive = active === id
              return (
                <li
                  key={id}
                  style={{
                    opacity: open ? 1 : 0,
                    transform: open ? 'translateY(0)' : 'translateY(20px)',
                    transition:
                      'opacity 0.5s var(--ease-cinematic), transform 0.5s var(--ease-cinematic)',
                    transitionDelay: open ? `${index * 60 + 120}ms` : '0ms',
                  }}
                >
                  <a
                    href={`#${id}`}
                    onClick={() => setOpen(false)}
                    aria-current={isActive ? 'true' : undefined}
                    className={`block border-l-2 py-3 pl-4 text-body font-medium transition-colors duration-200 hover:text-accent ${
                      isActive ? 'border-accent text-accent' : 'border-transparent text-ink-secondary'
                    }`}
                  >
                    {label}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </>
  )
}
