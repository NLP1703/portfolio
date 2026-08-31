export const site = {
  name: 'NDONGO Louis Pharel',
  alias: 'Obelix',
  monogram: 'NLP',
  role: 'Ingénieur Logiciel Full-Stack',
  location: 'Yaoundé, Cameroun',
  school: 'ICT University',
  availability: 'Disponible pour missions',
  languages: 'Français, anglais',
  typewriter: 'Full-Stack Developer · DevOps Enthusiast · Tech Creative',
  lede:
    "Jeune ingénieur logiciel camerounais. Je conçois des systèmes complets — du backend à l'infrastructure, de la documentation automatisée à l'intégration IA.",

  /** Laisser vide pour afficher le monogramme à la place d'une photo. */
  avatar: '',

  /** Déposer le fichier dans `public/` pour activer le bouton de téléchargement. */
  cv: '/CV-NDONGO-Louis-Pharel.pdf',

  links: {
    github: 'https://github.com/NLP1703',
    /** À renseigner : l'icône n'apparaît pas tant que la valeur est vide. */
    linkedin: '',
    email: 'pharelndongo2005@gmail.com',
  },

  /**
   * Endpoint de formulaire (Formspree, Web3Forms, Netlify Forms…).
   * Vide : le formulaire compose le message et ouvre la messagerie du
   * visiteur. Renseigné : le message part par requête POST et arrive
   * directement dans votre boîte, sans logiciel de messagerie côté visiteur.
   */
  formEndpoint: '' as string,

  /** `href` au format international, `display` pour l'affichage. */
  phones: [
    { display: '+237 6 56 76 33 41', href: '+237656763341' },
    { display: '+237 6 83 81 84 47', href: '+237683818447' },
  ],
} as const

export type SectionId =
  | 'accueil'
  | 'a-propos'
  | 'competences'
  | 'projets'
  | 'experiences'
  | 'contact'

export const navSections: { id: SectionId; label: string }[] = [
  { id: 'a-propos', label: 'À propos' },
  { id: 'competences', label: 'Compétences' },
  { id: 'projets', label: 'Projets' },
  { id: 'experiences', label: 'Expériences' },
  { id: 'contact', label: 'Contact' },
]

/** Titre de l'onglet, mis à jour selon la section visible. */
export const sectionTitles: Record<SectionId, string> = {
  accueil: `${site.name} — ${site.role}`,
  'a-propos': `À propos — ${site.name}`,
  competences: `Compétences — ${site.name}`,
  projets: `Projets — ${site.name}`,
  experiences: `Expériences — ${site.name}`,
  contact: `Contact — ${site.name}`,
}
