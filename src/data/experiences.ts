export type Experience = {
  title: string
  org: string
  detail: string
  meta?: string
}

export const experiences: Experience[] = [
  {
    title: 'Stage — Développement du système SIGES',
    org: 'MINPOSTEL / CELINFO',
    detail:
      "Conception et développement du système de gestion de réservation de salles du Ministère des Postes et Télécommunications, avec production automatisée du rapport de stage.",
    meta: 'Supervision : M. FOUDA BESSALA André, M. GABSA TUMA Emmanuel',
  },
  {
    title: "Projet de fin d'études",
    org: 'ICT University, Yaoundé',
    detail:
      "Ingénierie du Génie Logiciel. Conception et réalisation de K-MER EVENT, plateforme de billetterie événementielle pour le marché camerounais.",
    meta: 'Encadrement : M. ATANGANA Guy Martial',
  },
  {
    title: 'Architecture logicielle — TontineApp (SEN3244)',
    org: 'ICT University, Yaoundé',
    detail:
      "Conception et déploiement d'une plateforme de tontines découpée en trois microservices (Auth, Tontine, Notification), orchestrés sous K3s et livrés par un pipeline Jenkins.",
    meta:
      "Supervision : métriques exposées par chaque service, collecte Prometheus, tableaux de bord Grafana et alertes sur l'état du cluster.",
  },
]
