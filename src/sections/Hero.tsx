import { lazy } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { FiChevronDown } from 'react-icons/fi'
import { Avatar } from '../components/Avatar'
import { Magnetic } from '../components/Magnetic'
import { Scene3D } from '../components/Scene3D'
import { site } from '../data/site'
import { useTypewriter } from '../hooks/useTypewriter'
import { useVisible } from '../hooks/useVisible'

const HeroOrb = lazy(() => import('../three/HeroOrb'))

const NAME = site.name.toUpperCase()

/** La courbe cinématique, au format tableau attendu par Framer Motion. */
const EASE = [0.16, 1, 0.3, 1] as const

export function Hero() {
  const reduce = useReducedMotion()
  const { typed, done } = useTypewriter(site.typewriter, {
    speed: 45,
    startDelay: 800,
    enabled: !reduce,
  })

  const words = NAME.split(' ')
  const orb = useVisible<HTMLDivElement>()

  return (
    <section
      id="accueil"
      aria-labelledby="titre-accueil"
      className="flex min-h-[100svh] flex-col items-center justify-center px-6 pb-16 pt-[112px] text-center"
    >
      {/*
       * Le hero s'efface au fil du défilement (voir .scroll-fade) : il a
       * disparu avant que « À propos » ne commence sa propre séquence.
       * L'orbe et le texte ne partent pas à la même vitesse (voir .parallax-*) :
       * l'orbe s'avance et monte, le texte recule, les deux plans se détachent.
       */}
      <div className="scroll-fade flex w-full flex-col items-center">
        {/* L'avatar au cœur d'un polyèdre filaire qui suit le pointeur. */}
        <div
          ref={orb.ref}
          className="parallax-near relative grid h-[220px] w-[220px] place-items-center sm:h-[260px] sm:w-[260px]"
        >
          <Scene3D className="absolute inset-0">
            <HeroOrb animate={orb.visible && !reduce} />
          </Scene3D>
          <motion.div
            className="relative"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <Avatar />
          </motion.div>
        </div>

        <div className="parallax-far flex w-full flex-col items-center">
          <motion.h1
            id="titre-accueil"
            aria-label={site.name}
            className="mt-4 max-w-[16ch] text-[2rem] font-bold leading-[1.1] tracking-[-0.03em] sm:text-[2.75rem] lg:text-hero"
            initial={reduce ? false : 'hidden'}
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.04, delayChildren: 0.15 } } }}
          >
            {words.map((word, wordIndex) => (
              <span key={`${word}-${wordIndex}`} className="inline-block whitespace-nowrap" aria-hidden="true">
                {word.split('').map((letter, letterIndex) => (
                  <motion.span
                    key={`${letter}-${letterIndex}`}
                    className="inline-block"
                    // Chaque lettre fait le point en remontant, comme une mise au point d'objectif.
                    variants={{
                      hidden: { opacity: 0, y: '0.35em', filter: 'blur(8px)' },
                      visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
                    }}
                    transition={{ duration: 0.6, ease: EASE }}
                  >
                    {letter}
                  </motion.span>
                ))}
                {wordIndex < words.length - 1 && <span className="inline-block">&nbsp;</span>}
              </span>
            ))}
          </motion.h1>

          <p className="mt-5 min-h-[1.7em] text-body italic text-ink-secondary" aria-label={site.typewriter}>
            <span aria-hidden="true">{typed}</span>
            <span aria-hidden="true" className={`caret ml-1 ${done ? 'caret-finish' : 'caret-typing'}`} />
          </p>

          <motion.p
            className="mt-8 max-w-lede text-body text-ink-secondary"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1, ease: EASE }}
          >
            {site.lede}
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: EASE }}
          >
            <Magnetic>
              <a href="#projets" className="btn-primary">
                Voir mes projets
              </a>
            </Magnetic>
            <Magnetic>
              <a href="#contact" className="btn-secondary">
                Me contacter
              </a>
            </Magnetic>
          </motion.div>

          <motion.a
            href="#a-propos"
            aria-label="Descendre vers la section À propos"
            className="mt-16 text-ink-muted transition-colors duration-200 hover:text-accent"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.6, ease: EASE }}
          >
            <motion.span
              className="block"
              animate={reduce ? undefined : { y: [0, 6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <FiChevronDown size={24} aria-hidden="true" />
            </motion.span>
          </motion.a>
        </div>
      </div>
    </section>
  )
}
