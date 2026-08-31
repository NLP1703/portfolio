export type SkillGroup = {
  title: string
  items: string[]
}

export const skillGroups: SkillGroup[] = [
  {
    title: 'Frontend',
    items: ['React 18', 'Vite', 'TypeScript', 'Tailwind CSS', 'HTML/CSS', 'PHP'],
  },
  {
    title: 'Backend',
    items: ['Node.js', 'Express', 'NestJS', 'Laravel', 'Python', 'FastAPI'],
  },
  {
    title: 'Bases de données',
    items: ['PostgreSQL', 'MySQL', 'Redis'],
  },
  {
    title: 'DevOps',
    items: ['Docker', 'Kubernetes (K3s)', 'Jenkins CI/CD', 'Prometheus', 'Grafana', 'Ansible'],
  },
  {
    title: 'Documents',
    items: ['ReportLab', 'python-docx', 'pptxgenjs', 'LaTeX', 'XML docx'],
  },
  {
    title: 'Mobile',
    items: ['React Native', 'Expo', 'Collecte hors-ligne'],
  },
  {
    title: 'Autres',
    items: [
      'Git/GitHub',
      'Socket.IO',
      'Leaflet',
      'QR Code',
      'JWT',
      'Intégration IA',
      'Rédaction technique',
    ],
  },
]
