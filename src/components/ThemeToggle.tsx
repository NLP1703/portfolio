import { FiMoon, FiSun } from 'react-icons/fi'
import type { Theme } from '../hooks/useTheme'

type Props = {
  theme: Theme
  onToggle: () => void
}

export function ThemeToggle({ theme, onToggle }: Props) {
  const nextLabel = theme === 'dark' ? 'Activer le thème clair' : 'Activer le thème sombre'

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={nextLabel}
      title={nextLabel}
      className="grid h-10 w-10 place-items-center rounded-control border border-hairline text-ink-secondary transition-colors duration-200 hover:border-accent hover:text-accent"
    >
      {theme === 'dark' ? <FiSun size={18} aria-hidden="true" /> : <FiMoon size={18} aria-hidden="true" />}
    </button>
  )
}
