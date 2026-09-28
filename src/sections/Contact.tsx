import { lazy } from 'react'
import { useReducedMotion } from 'framer-motion'
import { FiGithub, FiLinkedin, FiMail, FiMapPin, FiPhone } from 'react-icons/fi'
import { ContactForm } from '../components/ContactForm'
import { Magnetic } from '../components/Magnetic'
import { Scene3D } from '../components/Scene3D'
import { Section, useSectionMotion } from '../components/Section'
import { SectionHeading } from '../components/SectionHeading'
import { Stagger } from '../components/Stagger'
import { site } from '../data/site'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useVisible } from '../hooks/useVisible'

const Globe = lazy(() => import('../three/Globe'))

type SocialLink = {
  label: string
  href: string
  icon: typeof FiGithub
  external: boolean
}

const socials: SocialLink[] = [
  { label: 'GitHub', href: site.links.github, icon: FiGithub, external: true },
  { label: 'LinkedIn', href: site.links.linkedin, icon: FiLinkedin, external: true },
  { label: 'Email', href: `mailto:${site.links.email}`, icon: FiMail, external: false },
].filter((link) => link.href && !link.href.endsWith('mailto:'))

/**
 * Globe à côté du formulaire, sur grand écran seulement : sur mobile il
 * pousserait le formulaire sous la ligne de flottaison pour un simple décor,
 * et le module 3D n'est alors même pas téléchargé.
 */
function ContactGlobe() {
  const inView = useSectionMotion()
  const reduce = useReducedMotion()
  const globe = useVisible<HTMLDivElement>()

  return (
    <Stagger show={inView} delay={200}>
      <figure className="flex flex-col items-center">
        <div ref={globe.ref} className="aspect-square w-full max-w-[440px]">
          <Scene3D className="h-full w-full">
            <Globe animate={globe.visible && !reduce} />
          </Scene3D>
        </div>
        <figcaption className="mt-2 inline-flex items-center gap-2 font-mono text-caption text-ink-muted">
          <FiMapPin size={14} className="text-accent" aria-hidden="true" />
          {site.location}
        </figcaption>
      </figure>
    </Stagger>
  )
}

function ContactBody() {
  const inView = useSectionMotion()

  return (
    <div className="flex flex-col items-center py-4 text-center">
      <Stagger show={inView} delay={0}>
        <p className="max-w-lede text-body text-ink-secondary">
          Intéressé par une collaboration, un stage ou une mission freelance ? Écrivez-moi, je réponds sous
          quelques jours.
        </p>
      </Stagger>

      <Stagger show={inView} delay={150} className="mt-8 w-full">
        <ContactForm />
      </Stagger>

      <Stagger show={inView} delay={250}>
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
          {site.phones.map((phone) => (
            <li key={phone.href}>
              <a
                href={`tel:${phone.href}`}
                aria-label={`Appeler le ${phone.display}`}
                className="inline-flex items-center gap-2 text-caption text-ink-secondary transition-colors duration-200 hover:text-accent"
              >
                <FiPhone size={16} className="text-accent" aria-hidden="true" />
                {phone.display}
              </a>
            </li>
          ))}
        </ul>
      </Stagger>

      <Stagger show={inView} delay={300} className="w-full">
        <div className="mx-auto mt-12 flex w-full max-w-sm items-center gap-4" aria-hidden="true">
          <span className="h-px flex-1 bg-hairline" />
          <span className="text-caption text-ink-muted">ou retrouvez-moi sur</span>
          <span className="h-px flex-1 bg-hairline" />
        </div>
      </Stagger>

      <Stagger show={inView} delay={400}>
        <ul className="mt-6 flex items-center gap-4">
          {socials.map(({ label, href, icon: Icon, external }) => (
            <li key={label}>
              <Magnetic strength={0.4}>
                <a
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                  aria-label={external ? `${label}, nouvel onglet` : label}
                  className="block p-2 text-ink-secondary transition-[color,transform] duration-300 hover:scale-110 hover:text-accent"
                  style={{ transitionTimingFunction: 'var(--ease-cinematic)' }}
                >
                  <Icon size={24} aria-hidden="true" />
                </a>
              </Magnetic>
            </li>
          ))}
        </ul>
      </Stagger>
    </div>
  )
}

function ContactLayout() {
  const wide = useMediaQuery('(min-width: 1024px)')

  if (!wide) return <ContactBody />

  return (
    <div className="grid items-center gap-12 lg:grid-cols-2">
      <ContactBody />
      <ContactGlobe />
    </div>
  )
}

export function Contact() {
  return (
    <Section id="contact" labelledBy="titre-contact">
      <SectionHeading id="titre-contact" title="Contact" />
      <ContactLayout />
    </Section>
  )
}
