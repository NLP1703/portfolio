import { site } from '../data/site'

export function Footer() {
  return (
    <footer className="border-t border-hairline">
      <div className="container-page py-8 text-center">
        <p className="text-caption text-ink-muted">
          Conçu &amp; développé par {site.name} — {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  )
}
