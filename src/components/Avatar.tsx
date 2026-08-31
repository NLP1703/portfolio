import { site } from '../data/site'

export function Avatar() {
  if (site.avatar) {
    return (
      <img
        src={site.avatar}
        alt={`Portrait de ${site.name}`}
        width={120}
        height={120}
        className="h-[120px] w-[120px] rounded-full border border-accent-line object-cover"
      />
    )
  }

  return (
    <div
      className="grid h-[120px] w-[120px] place-items-center rounded-full border border-accent-line bg-bg-secondary"
      role="img"
      aria-label={`Monogramme de ${site.name}`}
    >
      <span className="font-mono text-2xl font-bold tracking-tight text-accent">{site.monogram}</span>
    </div>
  )
}
