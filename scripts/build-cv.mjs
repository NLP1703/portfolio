/**
 * Génère `public/CV-NDONGO-Louis-Pharel.pdf` à partir des données du
 * portfolio. Le CV et le site partagent donc une seule source de vérité :
 * modifier `src/data/` puis lancer `npm run cv` suffit à les resynchroniser.
 */
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { buildPdf, escapeText, widthOf, wrap } from './pdf.mjs'
import { site } from '../src/data/site'
import { skillGroups } from '../src/data/skills'
import { projects } from '../src/data/projects'
import { experiences } from '../src/data/experiences'

const PAGE = { width: 595.28, height: 841.89 }
const MARGIN = { left: 50, right: 50, top: 42, bottom: 40 }
const COLUMN = PAGE.width - MARGIN.left - MARGIN.right

/** Mêmes rôles de couleur que le thème clair du site. */
const INK = '0.059 0.090 0.165'
const SECONDARY = '0.278 0.333 0.412'
const MUTED = '0.357 0.420 0.502'
const ACCENT = '0.055 0.455 0.565'

const finished = []
let stream = ''
let y = PAGE.height - MARGIN.top

function flushPage() {
  if (stream.trim()) finished.push(stream)
  stream = ''
  y = PAGE.height - MARGIN.top
}

/** Ouvre une nouvelle page si le bloc à venir ne tient plus. */
function reserve(height) {
  if (y - height < MARGIN.bottom) flushPage()
}

function draw(text, { x = MARGIN.left, size = 9.2, bold = false, color = INK }) {
  const font = bold ? '/F2' : '/F1'
  stream += `BT ${font} ${size} Tf ${color} rg 1 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)} Tm (${escapeText(text)}) Tj ET\n`
}

function line(text, options = {}) {
  const leading = options.leading ?? 11.0
  reserve(leading)
  draw(text, options)
  y -= leading
}

function paragraph(text, options = {}) {
  const { size = 9.2, bold = false, indent = 0, leading = 11.0 } = options
  const lines = wrap(text, COLUMN - indent, { size, bold })
  for (const item of lines) {
    line(item, { ...options, x: MARGIN.left + indent, size, bold, leading })
  }
}

function gap(height) {
  y -= height
}

/** Titre de section : le trait d'accent du site, puis le libellé. */
function heading(text) {
  if (process.env.CV_DEBUG) console.error(`  ${text.padEnd(13)} y=${y.toFixed(0)}`)
  reserve(40)
  gap(9)
  stream += `${ACCENT} rg ${MARGIN.left} ${(y + 4).toFixed(2)} 24 1.6 re f\n`
  y -= 9
  line(text.toUpperCase(), { bold: true, size: 9.8, color: ACCENT, leading: 13 })
}

/** Libellé en gras suivi d'un texte courant, avec alinéa négatif. */
function labelled(label, body) {
  const labelWidth = widthOf(`${label}  `, { bold: true, size: 9.2 })
  const lines = wrap(body, COLUMN - labelWidth, { size: 9.2 })

  reserve(11.0)
  draw(label, { bold: true })
  draw(lines[0] ?? '', { x: MARGIN.left + labelWidth, color: SECONDARY })
  y -= 11.0

  for (const item of lines.slice(1)) {
    line(item, { x: MARGIN.left + labelWidth, color: SECONDARY })
  }
}

// ---------------------------------------------------------------- en-tête
line(site.name.toUpperCase(), { bold: true, size: 19, leading: 24 })
line(site.role, { size: 11, color: ACCENT, leading: 16 })
line(`${site.location}    ${site.links.email}`, { size: 8.8, color: MUTED, leading: 11.5 })
line(
  `${site.phones.map((phone) => phone.display).join('    ')}    ${site.links.github.replace('https://', '')}`,
  { size: 8.8, color: MUTED, leading: 11.5 },
)

// ------------------------------------------------------------------ profil
heading('Profil')
paragraph(
  "Ingénieur logiciel full-stack diplômé de l'ICT University à Yaoundé. Je conçois des systèmes " +
    'complets — architecture microservices, DevOps et monitoring, automatisation documentaire, ' +
    "intégration IA — dans les contraintes de l'écosystème tech francophone africain, du paiement " +
    'Mobile Money aux normes académiques locales.',
  { color: SECONDARY },
)

// ------------------------------------------------------------- compétences
heading('Compétences')
for (const group of skillGroups) {
  labelled(group.title, group.items.join(', '))
}

// ----------------------------------------------------------------- projets
heading('Projets')
for (const project of projects) {
  reserve(52)
  const nameWidth = widthOf(`${project.name}  `, { bold: true, size: 10.2 })
  draw(project.name, { bold: true, size: 10.2 })
  draw(project.statusLabel ?? project.label, {
    x: MARGIN.left + nameWidth,
    size: 8.5,
    color: project.status === 'design' ? MUTED : ACCENT,
  })
  y -= 12.6

  paragraph(project.description, { color: SECONDARY })
  labelled('Stack', project.stack.join(', '))
  if (project.github) {
    line(project.github.replace('https://', ''), { size: 8.3, color: MUTED, leading: 11 })
  }
  gap(5)
}

// ------------------------------------------------------------- expériences
heading('Expériences')
for (const experience of experiences) {
  reserve(52)
  line(experience.title, { bold: true, size: 10.2, leading: 12.6 })
  line(experience.org, { size: 8.8, color: ACCENT, leading: 12 })
  paragraph(experience.detail, { color: SECONDARY })
  if (experience.meta) paragraph(experience.meta, { size: 8.3, color: MUTED, leading: 10.6 })
  gap(5)
}

// --------------------------------------------------------------- formation
heading('Formation')
const diploma = 'Ingénieur en Génie Logiciel'
draw(diploma, { bold: true, size: 10.2 })
draw(`   ${site.school}, Yaoundé`, {
  x: MARGIN.left + widthOf(diploma, { bold: true, size: 10.2 }),
  size: 8.8,
  color: ACCENT,
})
y -= 12.6
labelled('Langues', site.languages)

flushPage()

// ------------------------------------------------------- pieds de page
const pages = finished.length === 1 ? finished : finished.map((content, index) => {
  const label = `${site.name}    ${index + 1} / ${finished.length}`
  const x = PAGE.width - MARGIN.right - widthOf(label, { size: 8 })
  return (
    content +
    `BT /F1 8 Tf ${MUTED} rg 1 0 0 1 ${x.toFixed(2)} ${(MARGIN.bottom - 16).toFixed(2)} Tm ` +
    `(${escapeText(label)}) Tj ET\n`
  )
})

const { file, offsets, count } = buildPdf({
  pages,
  width: PAGE.width,
  height: PAGE.height,
  title: `CV — ${site.name}`,
  author: site.name,
})

// Contrôle d'intégrité : chaque entrée xref doit pointer sur son objet.
for (let number = 1; number < count; number += 1) {
  const expected = `${number} 0 obj`
  const found = file.slice(offsets[number], offsets[number] + expected.length)
  if (found !== expected) {
    throw new Error(`Table xref incohérente pour l'objet ${number} : « ${found} »`)
  }
}

// Le script est bundlé ailleurs avant exécution : on part de la racine du projet.
const output = join(process.cwd(), 'public', 'CV-NDONGO-Louis-Pharel.pdf')
writeFileSync(output, Buffer.from(file, 'latin1'))

console.log(`CV généré : ${finished.length} page(s), ${(file.length / 1024).toFixed(1)} Ko`)
console.log(output)
