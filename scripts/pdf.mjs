/**
 * Générateur PDF minimal, sans dépendance.
 *
 * Produit un PDF 1.4 à partir des polices Type1 standard (Helvetica), qui
 * n'ont pas besoin d'être embarquées : tout lecteur les possède. Le texte est
 * encodé en WinAnsi, ce qui couvre l'ensemble des accents français.
 */

/** Largeurs Helvetica en millièmes de point (table AFM Adobe). */
const REGULAR = {
  ' ': 278, '!': 278, '"': 355, '#': 556, $: 556, '%': 889, '&': 667, "'": 191,
  '(': 333, ')': 333, '*': 389, '+': 584, ',': 278, '-': 333, '.': 278, '/': 278,
  ':': 278, ';': 278, '<': 584, '=': 584, '>': 584, '?': 556, '@': 1015,
  A: 667, B: 667, C: 722, D: 722, E: 667, F: 611, G: 778, H: 722, I: 278, J: 500,
  K: 667, L: 556, M: 833, N: 722, O: 778, P: 667, Q: 778, R: 722, S: 667, T: 611,
  U: 722, V: 667, W: 944, X: 667, Y: 667, Z: 611,
  '[': 278, ']': 278, '^': 469, _: 556, '`': 333,
  a: 556, b: 556, c: 500, d: 556, e: 556, f: 278, g: 556, h: 556, i: 222, j: 222,
  k: 500, l: 222, m: 833, n: 556, o: 556, p: 556, q: 556, r: 333, s: 500, t: 278,
  u: 556, v: 500, w: 722, x: 500, y: 500, z: 500,
  '{': 334, '|': 260, '}': 334, '~': 584,
}

const BOLD = {
  ' ': 278, '!': 333, '"': 474, '#': 556, $: 556, '%': 889, '&': 722, "'": 238,
  '(': 333, ')': 333, '*': 389, '+': 584, ',': 278, '-': 333, '.': 278, '/': 278,
  ':': 333, ';': 333, '<': 584, '=': 584, '>': 584, '?': 611, '@': 975,
  A: 722, B: 722, C: 722, D: 722, E: 667, F: 611, G: 778, H: 722, I: 278, J: 556,
  K: 722, L: 611, M: 833, N: 722, O: 778, P: 667, Q: 778, R: 722, S: 667, T: 611,
  U: 722, V: 667, W: 944, X: 667, Y: 667, Z: 611,
  '[': 333, ']': 333, '^': 584, _: 556, '`': 333,
  a: 556, b: 611, c: 556, d: 611, e: 556, f: 333, g: 611, h: 611, i: 278, j: 278,
  k: 556, l: 278, m: 889, n: 611, o: 611, p: 611, q: 611, r: 389, s: 556, t: 333,
  u: 611, v: 556, w: 778, x: 556, y: 556, z: 500,
  '{': 389, '|': 280, '}': 389, '~': 584,
}

/** Litteral d'antislash, construit par code pour rester lisible en source. */
const BACKSLASH = String.fromCharCode(92)

for (const table of [REGULAR, BOLD]) {
  for (const digit of '0123456789') table[digit] = 556
  table[BACKSLASH] = 278
}

/** Un caractère accentué a la largeur de sa lettre de base. */
const BASE_LETTER = {
  à: 'a', â: 'a', ä: 'a', á: 'a', ã: 'a', å: 'a',
  è: 'e', é: 'e', ê: 'e', ë: 'e',
  ì: 'i', í: 'i', î: 'i', ï: 'i',
  ò: 'o', ó: 'o', ô: 'o', ö: 'o', õ: 'o',
  ù: 'u', ú: 'u', û: 'u', ü: 'u',
  ç: 'c', ñ: 'n', ý: 'y', ÿ: 'y',
  À: 'A', Â: 'A', Ä: 'A', Á: 'A', È: 'E', É: 'E', Ê: 'E', Ë: 'E',
  Î: 'I', Ï: 'I', Ô: 'O', Ö: 'O', Û: 'U', Ü: 'U', Ç: 'C', Ñ: 'N',
}

/** Caractères hors Latin-1, à replier sur les positions CP1252. */
const CP1252 = {
  '€': 0x80, '‚': 0x82, 'ƒ': 0x83, '„': 0x84, '…': 0x85,
  '†': 0x86, '‡': 0x87, 'ˆ': 0x88, '‰': 0x89, 'Š': 0x8a,
  '‹': 0x8b, 'Œ': 0x8c, 'Ž': 0x8e, '‘': 0x91, '’': 0x92,
  '“': 0x93, '”': 0x94, '•': 0x95, '–': 0x96, '—': 0x97,
  '˜': 0x98, '™': 0x99, 'š': 0x9a, '›': 0x9b, 'œ': 0x9c,
  'ž': 0x9e, 'Ÿ': 0x9f,
}

/** Convertit une chaîne en octets WinAnsi, portés par une chaîne latin-1. */
export function winAnsi(text) {
  let out = ''
  for (const char of text) {
    const code = char.codePointAt(0)
    if (code < 0x80 || (code >= 0xa0 && code <= 0xff)) out += String.fromCharCode(code)
    else if (CP1252[char] !== undefined) out += String.fromCharCode(CP1252[char])
    else out += '?'
  }
  return out
}

/** Les trois caracteres que la syntaxe des chaines PDF reserve. */
function escapeText(text) {
  let out = ''
  for (const char of winAnsi(text)) {
    if (char === BACKSLASH || char === '(' || char === ')') out += BACKSLASH
    out += char
  }
  return out
}

export function widthOf(text, { bold = false, size = 10 } = {}) {
  const table = bold ? BOLD : REGULAR
  let units = 0
  for (const char of text) {
    const key = BASE_LETTER[char] ?? char
    units += table[key] ?? table[' ']
  }
  return (units * size) / 1000
}

/** Découpe un texte en lignes qui tiennent dans `maxWidth`. */
export function wrap(text, maxWidth, options) {
  const lines = []
  let line = ''

  for (const word of text.split(/\s+/)) {
    const candidate = line ? `${line} ${word}` : word
    if (line && widthOf(candidate, options) > maxWidth) {
      lines.push(line)
      line = word
    } else {
      line = candidate
    }
  }

  if (line) lines.push(line)
  return lines
}

/**
 * Assemble les objets, la table xref et la bande-annonce du fichier.
 * Chaque page reçoit son flux de contenu ; les deux polices sont partagées.
 */
export function buildPdf({ pages, width, height, title, author }) {
  const objects = []
  const set = (number, body) => {
    objects[number] = body
  }

  set(1, '<< /Type /Catalog /Pages 2 0 R >>')
  set(3, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>')
  set(4, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>')
  set(
    5,
    `<< /Title (${escapeText(title)}) /Author (${escapeText(author)}) ` +
      `/Creator (build-cv.mjs) /Producer (build-cv.mjs) >>`,
  )

  let next = 6
  const kids = []

  for (const content of pages) {
    const pageNumber = next++
    const contentNumber = next++
    kids.push(`${pageNumber} 0 R`)

    set(
      pageNumber,
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${width} ${height}] ` +
        `/Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentNumber} 0 R >>`,
    )
    set(contentNumber, `<< /Length ${content.length} >>\nstream\n${content}\nendstream`)
  }

  set(2, `<< /Type /Pages /Kids [${kids.join(' ')}] /Count ${pages.length} >>`)

  let file = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n'
  const offsets = []

  for (let number = 1; number < next; number += 1) {
    offsets[number] = file.length
    file += `${number} 0 obj\n${objects[number]}\nendobj\n`
  }

  const xrefOffset = file.length
  file += `xref\n0 ${next}\n0000000000 65535 f \n`
  for (let number = 1; number < next; number += 1) {
    file += `${String(offsets[number]).padStart(10, '0')} 00000 n \n`
  }
  file += `trailer\n<< /Size ${next} /Root 1 0 R /Info 5 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`

  return { file, offsets, count: next }
}

export { escapeText }
