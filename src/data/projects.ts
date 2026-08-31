export type ProjectStatus = 'shipped' | 'ongoing' | 'design'

export type Project = {
  id: string
  name: string
  label: string
  status: ProjectStatus
  statusLabel?: string
  description: string
  highlights: string[]
  stack: string[]
  github?: string
  /** Image optionnelle (déposer dans `public/`), sinon la vignette générative est utilisée. */
  image?: string
  terminal: string[]
}

export const projects: Project[] = [
  {
    id: 'k-mer-event',
    name: 'K-MER EVENT',
    label: "Projet de fin d'études",
    status: 'shipped',
    description:
      "Plateforme web de découverte d'événements, de réservation et de billetterie sécurisée par QR code pour le marché camerounais. Génération de tickets PDF, partage WhatsApp, paiement Mobile Money et tableau de bord organisateur.",
    highlights: [
      'Billetterie avec QR code signé et contrôle à l\'entrée',
      'Paiement Mobile Money : Orange Money et MTN MoMo',
      'Tickets PDF générés à la volée et partagés via WhatsApp',
      'Notifications temps réel organisateur avec Socket.IO',
      'Carte des événements et géolocalisation avec Leaflet',
    ],
    stack: [
      'React 18',
      'Vite',
      'Tailwind',
      'Node.js',
      'Express',
      'Sequelize',
      'MySQL',
      'JWT',
      'Socket.IO',
      'PDFKit',
      'qrcode',
      'Leaflet',
    ],
    github: 'https://github.com/NLP1703/k-mer-event',
    terminal: ['GET  /api/events        200', 'POST /api/tickets/scan  200', 'ws   organizer:sale     ↑'],
  },
  {
    id: 'tontineapp',
    name: 'TontineApp',
    label: 'Architecture Logicielle (SEN3244)',
    status: 'shipped',
    description:
      "Plateforme microservices de gestion de tontines africaines avec calendrier de rotation. Trois services indépendants (Auth, Tontine, Notification), monitoring complet et pipeline d'intégration continue.",
    highlights: [
      'Trois microservices découplés : Auth, Tontine, Notification',
      'Calendrier de rotation et suivi des cotisations',
      'Orchestration K3s, déploiement automatisé par Ansible',
      'Pipeline Jenkins : build, tests, publication des images',
      'Observabilité Prometheus et tableaux de bord Grafana',
    ],
    stack: [
      'React 18',
      'Node.js',
      'Express',
      'PostgreSQL',
      'Redis',
      'Docker',
      'K3s',
      'Jenkins',
      'Prometheus',
      'Grafana',
      'Ansible',
    ],
    terminal: ['auth-svc      Running  1/1', 'tontine-svc   Running  2/2', 'notify-svc    Running  1/1'],
  },
  {
    id: 'siges-minpostel',
    name: 'SIGES-MINPOSTEL',
    label: 'Stage professionnel',
    status: 'shipped',
    description:
      "Système de gestion de réservation de salles pour le Ministère des Postes et Télécommunications, accompagné d'un rapport de stage entièrement automatisé.",
    highlights: [
      'Réservation et planning des salles institutionnelles',
      'Rapport PDF généré par code : double pagination, couverture personnalisée',
      'Diagrammes UML intégrés au document final',
      'Assemblage et post-traitement des PDF avec pypdf',
    ],
    stack: ['Python', 'ReportLab', 'pypdf', 'UML'],
    terminal: ['build_report.py  →  rapport.pdf', 'pages: 78  (i–xii + 1–66)', 'uml: 9 diagrammes intégrés'],
  },
  {
    id: 'mds-insight',
    name: 'MDS Insight',
    label: 'Plateforme études de marché',
    status: 'design',
    statusLabel: 'En conception',
    description:
      "Plateforme intelligente d'études de marché : collecte terrain hors-ligne, contrôle qualité automatique, détection d'anomalies par IA, génération de rapports et portail client. Conforme à la norme ISO 20252.",
    highlights: [
      'Collecte terrain hors-ligne sur mobile, synchronisation différée',
      'Contrôle qualité automatique des questionnaires',
      "Détection d'anomalies et de réponses incohérentes par IA",
      'Génération de rapports et portail client dédié',
      'Stockage objet MinIO, services NestJS et FastAPI',
    ],
    stack: [
      'React',
      'Vite',
      'TypeScript',
      'Tailwind',
      'React Native',
      'Expo',
      'NestJS',
      'FastAPI',
      'PostgreSQL',
      'Redis',
      'MinIO',
      'Docker',
    ],
    terminal: ['sync  120 questionnaires  ✓', 'qc    3 anomalies détectées', 'iso   20252  conforme'],
  },
]
