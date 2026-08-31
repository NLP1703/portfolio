import { FiBriefcase, FiDownload, FiGlobe, FiMapPin } from 'react-icons/fi'
import { LuGraduationCap } from 'react-icons/lu'
import { Section, useSectionMotion } from '../components/Section'
import { SectionHeading } from '../components/SectionHeading'
import { Stagger } from '../components/Stagger'
import { site } from '../data/site'

const distinctions = [
  "Je livre des systèmes complets, pas des maquettes : backend, base de données, déploiement et supervision.",
  "Je connais les contraintes du terrain africain francophone — Mobile Money, connexions instables, normes académiques locales.",
  "J'automatise la production documentaire là où d'autres la font à la main.",
]

function AboutBody() {
  const inView = useSectionMotion()

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-7">
        <Stagger show={inView} delay={0}>
          <p className="max-w-bio text-body text-ink-secondary">
            Diplômé en Ingénierie du Génie Logiciel de l'ICT University à Yaoundé, je ne me limite pas au
            code. Je conçois des architectures complètes — microservices, DevOps, monitoring —, j'automatise
            la production de documents institutionnels, et je sais naviguer les réalités de l'écosystème tech
            francophone africain, du paiement Mobile Money aux normes académiques locales.
          </p>
        </Stagger>

        <Stagger show={inView} delay={150}>
          <h3 className="mt-10 text-cardtitle">Ce qui me distingue</h3>
          <ul className="mt-4 max-w-bio space-y-3">
            {distinctions.map((item) => (
              <li key={item} className="flex gap-3 text-body text-ink-secondary">
                <span aria-hidden="true" className="mt-[0.7em] h-[2px] w-4 shrink-0 bg-accent" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Stagger>
      </div>

      <Stagger show={inView} delay={300} className="lg:col-span-5">
        <aside aria-label="Informations rapides">
          <ul className="space-y-3">
            <li className="card flex items-center gap-4">
              <FiMapPin size={18} className="shrink-0 text-accent" aria-hidden="true" />
              <div>
                <p className="text-caption text-ink-muted">Localisation</p>
                <p className="text-caption font-medium text-ink-primary">{site.location}</p>
              </div>
            </li>

            <li className="card flex items-center gap-4">
              <LuGraduationCap size={18} className="shrink-0 text-accent" aria-hidden="true" />
              <div>
                <p className="text-caption text-ink-muted">Formation</p>
                <p className="text-caption font-medium text-ink-primary">
                  Ingénieur en Génie Logiciel, {site.school}
                </p>
              </div>
            </li>

            <li className="card flex items-center gap-4">
              <FiBriefcase size={18} className="shrink-0 text-accent" aria-hidden="true" />
              <div>
                <p className="text-caption text-ink-muted">Statut</p>
                <p className="flex items-center gap-2 text-caption font-medium text-ink-primary">
                  <span aria-hidden="true" className="h-2 w-2 rounded-full bg-signal-green" />
                  {site.availability}
                </p>
              </div>
            </li>

            <li className="card flex items-center gap-4">
              <FiGlobe size={18} className="shrink-0 text-accent" aria-hidden="true" />
              <div>
                <p className="text-caption text-ink-muted">Langues</p>
                <p className="text-caption font-medium text-ink-primary">{site.languages}</p>
              </div>
            </li>
          </ul>

          <a href={site.cv} download className="btn-secondary mt-6 w-full">
            <FiDownload size={16} aria-hidden="true" />
            Télécharger le CV
          </a>
        </aside>
      </Stagger>
    </div>
  )
}

export function About() {
  return (
    <Section id="a-propos" labelledBy="titre-a-propos">
      <SectionHeading id="titre-a-propos" title="À propos" />
      <AboutBody />
    </Section>
  )
}
