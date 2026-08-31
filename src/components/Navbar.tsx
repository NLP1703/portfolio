import { useEffect, useRef, useState } from 'react'
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

export function Navbar({ active, theme, onToggleTheme, scrolled }: Props) {
  const [open, setOpen] = useState(false)
  const [entered, setEntered] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

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

          <ul className="hidden items-center gap-5 sm:flex lg:gap-8">
            {navSections.map(({ id, label }, index) => {
              const isActive = active === id
              return (
                <li key={id} className="relative" style={entrance(index * LINK_STEP + LINK_OFFSET)}>
                  <a
                    href={`#${id}`}
                    aria-current={isActive ? 'true' : undefined}
                    className={`block py-2 text-caption font-medium transition-colors duration-200 hover:text-accent ${
                      isActive ? 'text-accent' : 'text-ink-secondary'
                    }`}
                  >
                    {label}
                  </a>
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-0.5 left-0 block h-[2px] bg-accent"
                    style={{
                      width: isActive ? '100%' : '0%',
                      transition: 'width 0.6s var(--ease-cinematic)',
                    }}
                  />
                </li>
              )
            })}
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
