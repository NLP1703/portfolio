import { FiGithub, FiLinkedin, FiMail, FiPhone } from 'react-icons/fi'
import { Section, useSectionMotion } from '../components/Section'
import { SectionHeading } from '../components/SectionHeading'
import { Stagger } from '../components/Stagger'
import { site } from '../data/site'

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

      <Stagger show={inView} delay={150}>
        <a href={`mailto:${site.links.email}`} className="btn-primary mt-8">
          Me contacter par email
        </a>
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
        <ul className="mt-8 flex items-center gap-8">
          {socials.map(({ label, href, icon: Icon, external }) => (
            <li key={label}>
              <a
                href={href}
                {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                aria-label={external ? `${label}, nouvel onglet` : label}
                className="block text-ink-secondary transition-[color,transform] duration-300 hover:scale-110 hover:text-accent"
                style={{ transitionTimingFunction: 'var(--ease-cinematic)' }}
              >
                <Icon size={24} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </Stagger>
    </div>
  )
}

export function Contact() {
  return (
    <Section id="contact" labelledBy="titre-contact">
      <SectionHeading id="titre-contact" title="Contact" />
      <ContactBody />
    </Section>
  )
}
