# Portfolio — NDONGO Louis Pharel

Portfolio personnel de **NDONGO Louis Pharel** (*Obelix*), ingénieur logiciel full-stack basé à Yaoundé.
Page unique, thème sombre par défaut, esthétique « terminal élégant » : aplats de couleur, aucune
ombre générique, aucun dégradé.

## Stack

- React 18 + TypeScript + Vite 5
- Tailwind CSS 3 (design tokens en variables CSS, thèmes sombre et clair)
- Framer Motion (animations, `useReducedMotion` respecté partout)
- React Icons (Feather + Lucide)

## Démarrer

```bash
npm install
npm run dev        # http://localhost:5173
```

Autres scripts :

```bash
npm run build      # typecheck (tsc -b) puis build de production dans dist/
npm run preview    # sert le build de production localement
npm run typecheck  # vérification TypeScript seule
```

## Structure

```
index.html               meta SEO / Open Graph, chargement des polices, thème avant le premier paint
src/
  main.tsx               point d'entrée
  App.tsx                navbar + sections + footer, titre d'onglet dynamique
  data/                  contenu éditable (site, compétences, projets, expériences)
  sections/              Hero, About, Skills, Projects, Experience, Contact
  components/            Navbar, ThemeToggle, Section, SectionHeading, Stagger, Avatar,
                         ProjectThumb, Footer
  hooks/                 useTheme, useActiveSection, useTypewriter, useInView,
                         useScrollMotion
  styles/index.css       tokens de couleur, classes .btn / .tag / .card, animations
public/                  favicon, robots.txt, et vos fichiers statiques (CV, og-image)
```

Tout le contenu textuel vit dans `src/data/` : aucun texte n'est codé en dur dans un composant
au-delà des deux paragraphes de la section « À propos ».

## À personnaliser avant mise en ligne

Dans [`src/data/site.ts`](src/data/site.ts) :

| Champ | À faire |
|---|---|
| `links.linkedin` | Vide par défaut : l'icône LinkedIn n'apparaît pas tant que l'URL n'est pas renseignée. |
| `links.email` | `pharelndongo2005@gmail.com`, confirmé. |
| `phones` | Deux numéros, affichés dans la section Contact en liens `tel:`. Indicatif `+237` supposé. |
| `avatar` | Vide : le monogramme « NLP » est affiché. Renseignez `/photo.jpg` après avoir déposé le fichier dans `public/`. |
| `cv` | Le bouton pointe vers `/CV-NDONGO-Louis-Pharel.pdf` : déposez ce PDF dans `public/`. |

Fichiers statiques à ajouter dans `public/` :

- `CV-NDONGO-Louis-Pharel.pdf` — cible du bouton « Télécharger le CV »
- `og-image.png` — image de partage social, **1200 × 630 px** (référencée dans `index.html`)

Enfin, remplacez l'URL `https://ndongo-louis-pharel.vercel.app/` dans `index.html` et
`public/robots.txt` par le domaine réel une fois le site déployé.

Pour ajouter une capture d'écran à un projet : déposez l'image dans `public/` puis renseignez le
champ `image` du projet dans [`src/data/projects.ts`](src/data/projects.ts). Sans image, une vignette
générative en aplats (fenêtre de terminal) est utilisée.

## Déploiement

**Vercel** — importez le dépôt, le fichier `vercel.json` fournit déjà le framework, la commande de
build et le dossier de sortie. Ou en ligne de commande :

```bash
npm i -g vercel
vercel --prod
```

**Netlify** — importez le dépôt, `netlify.toml` fournit `npm run build` et le dossier `dist`. Ou :

```bash
npm i -g netlify-cli
npm run build && netlify deploy --prod --dir=dist
```

**GitHub Pages** — ajoutez `base: '/<nom-du-depot>/'` dans `vite.config.ts` avant de publier `dist/`.

## Design system

Les tokens sont déclarés une seule fois dans `src/styles/index.css` et exposés à Tailwind via
`tailwind.config.js` (`bg-bg-primary`, `text-ink-secondary`, `border-hairline`, `text-accent`…).

| Rôle | Sombre | Clair |
|---|---|---|
| Fond principal | `#0A0F1C` | `#F4F7FA` |
| Fond secondaire / cards | `#111827` | `#FFFFFF` |
| Surélevé / puces neutres | `#1E293B` | `#E8EEF5` |
| Survol de card | `#16202F` | `#F7FBFC` |
| Texte principal | `#E2E8F0` | `#0F172A` |
| Texte secondaire | `#94A3B8` | `#475569` |
| Texte discret | `#74839A`* | `#5B6B80`* |
| Accent | `#22D3EE` | `#0E7490` |
| Accent survol | `#06B6D4` | `#155E75` |
| Signal « en cours » | `#4ADE80` | `#15803D` |
| Signal « en conception » | `#FBBF24` | `#B45309` |

**Trois paliers de surface.** Le fond de page est teinté, les cards sont blanches (clair) ou plus
claires que le fond (sombre), et le palier surélevé porte les puces neutres. Le thème clair
reposait auparavant sur deux gris voisins — `#FAFBFC` et `#F1F5F9`, soit un écart de 1.06:1, sous
le seuil de perception d'une élévation. Il est passé à 1.08:1, exactement le même écart que le
thème sombre : les deux thèmes ont désormais la même profondeur.

**Deux niveaux de puce.** Le cyan signale une compétence (section Compétences, où la puce *est* le
contenu). La stack d'un projet — jusqu'à douze puces sous une description — passe en `.tag-muted` :
même forme, fond surélevé, texte secondaire. Cela ramène l'accent bien sous le plafond de 15 % de
surface visible, et rend au titre du projet et à ses boutons la priorité qui leur revient.

\* Deux écarts assumés par rapport à la palette d'origine, tous deux pour atteindre le contraste AA
exigé dans les livrables :

- **Texte discret, thème sombre** — le `#64748B` spécifié donne 4.03:1 sur `#0A0F1C`, sous le seuil
  AA de 4.5:1 pour du texte de 14 px. Remonté à `#74839A` (4.97:1), qui reste nettement en retrait
  du texte secondaire. Pour revenir à la valeur d'origine : `--text-muted` dans
  `src/styles/index.css`.
- **Texte discret, thème clair** — assombri à `#5B6B80` (5.06:1). Le `#64748B` d'origine tombait à
  4.43:1 sur le nouveau fond de page teinté.
- **Accent, thème clair** — le cyan `#22D3EE` est illisible sur fond clair ; le thème clair utilise
  `#0E7490` (5.17:1). Le thème sombre conserve `#22D3EE` à l'identique.

**Typographie** — JetBrains Mono 700 pour les titres, la navigation, les boutons et les badges ;
Inter 400/500 pour le texte courant. Corps de texte limité à 70 caractères, jamais justifié.

**Rythme vertical** — le padding d'une section (36 / 48 / 60 px selon le breakpoint) s'additionne à
celui de la suivante pour produire les espacements inter-sections demandés : 72 px en mobile,
96 px en tablette, 120 px en desktop.

**Rayons** — 12 px sur les cards, 6 px sur les boutons et les badges, jamais la même valeur partout.

## Système de mouvement

Deux courbes, déclarées une fois dans `src/styles/index.css` et utilisées partout — c'est ce qui
fait tenir l'ensemble comme un seul système :

| Jeton | Valeur | Usage |
|---|---|---|
| `--ease-cinematic` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entrées, séquences, survols, boutons, cards |
| `--ease-overlay` | `cubic-bezier(0.4, 0, 0.2, 1)` | Surfaces qui apparaissent en bloc : navbar, menu mobile |

**Séquences de section** — chaque section possède un unique déclencheur d'entrée
(`Section` + `useInView`, un IntersectionObserver qui se déconnecte après le premier passage),
diffusé à ses enfants par contexte. Les enfants s'échelonnent avec
[`Stagger`](src/components/Stagger.tsx) : opacité 0 → 1 et remontée de 24 px sur 0,8 s en
`--ease-cinematic`, seul le délai varie.

| Section | Délais |
|---|---|
| Titre de section | trait 0 ms (largeur 0 → 40 px, 0,8 s), titre 100 ms |
| À propos | bio 0 ms, « ce qui me distingue » 150 ms, colonne infos 300 ms |
| Compétences | 80 ms par carte |
| Projets | 120 ms par carte |
| Expériences | 120 ms par jalon |
| Contact | 0 / 150 / 300 / 400 ms |

**Progression de défilement lissée** — [`useScrollMotion`](src/hooks/useScrollMotion.ts) interpole
`window.scrollY` image par image (lerp exponentiel, `LERP_TAU = 8`, accroche à `SNAP = 0.002`) et
publie le résultat dans la variable CSS `--scroll-progress`. Aucun état React n'est mis à jour
pendant le scroll : la page ne se redessine pas. Deux consommateurs :

- le hero s'efface au défilement (`.scroll-fade`, disparu à 55 % d'un viewport) — une séquence
  chasse l'autre, elles ne se superposent jamais ;
- la navbar est transparente au-dessus du hero puis prend son fond et sa bordure en 500 ms.

**Entrée de la navbar** — 200 ms après le montage, chaque lien descend de `-12 px` en 0,6 s, décalé
de 80 ms (`i * 80 + 100`) ; le groupe de droite suit à 500 ms.

**Menu mobile** — le panneau reste monté et bascule sur `opacity` / `visibility` en 500 ms
(`--ease-overlay`, `visibility: hidden` le sort aussi de l'ordre de tabulation), glisse depuis la
droite, et ses liens entrent en séquence à 60 ms d'intervalle depuis `translateY(20px)`.

**Hero** — nom lettre par lettre (stagger 40 ms), titre en machine à écrire après 800 ms, curseur
qui clignote trois fois puis disparaît, accroche et CTA à 1 s et 1,2 s.

> **Écart assumé par rapport au brief initial.** Celui-ci proscrivait tout « fade-slide-up par
> élément au scroll » au profit d'un fondu unique par section. Le système ci-dessus réintroduit une
> remontée de 24 px, mais en séquence orchestrée — un seul déclencheur par section, 3 à 4 groupes
> échelonnés — et non en animation indépendante par élément. Pour revenir au fondu strict :
> supprimer le `transform` de `Stagger`.

## Accessibilité

- Lien d'évitement « Aller au contenu » en début de page
- Chaque section porte un `aria-labelledby` pointant vers son titre
- `aria-current` sur le lien de navigation actif, `aria-expanded` / `aria-controls` sur le menu
  mobile et les blocs « Détails »
- Menu mobile : fermeture par `Échap`, scroll du corps verrouillé, focus rendu au bouton
- Focus visible (contour accent 2 px) sur tous les éléments interactifs
- Le nom animé lettre par lettre est exposé aux lecteurs d'écran via `aria-label`, les lettres
  individuelles sont masquées
- `prefers-reduced-motion` : machine à écrire, fondus, panneau mobile et chevron sont neutralisés
