/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          elevated: 'var(--bg-elevated)',
        },
        ink: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          soft: 'var(--accent-soft)',
          line: 'var(--accent-line)',
        },
        signal: {
          green: 'var(--green)',
          amber: 'var(--amber)',
        },
        hairline: 'var(--hairline)',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        hero: ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        section: ['2rem', { lineHeight: '1.3', letterSpacing: '-0.02em' }],
        cardtitle: ['1.25rem', { lineHeight: '1.4' }],
        body: ['1rem', { lineHeight: '1.7' }],
        caption: ['0.875rem', { lineHeight: '1.5' }],
        tag: ['0.75rem', { lineHeight: '1' }],
      },
      maxWidth: {
        container: '1200px',
        measure: '70ch',
        lede: '50ch',
        bio: '60ch',
      },
      boxShadow: {
        glow: '0 0 20px var(--accent-glow)',
      },
      borderRadius: {
        card: '12px',
        control: '6px',
      },
      transitionDuration: {
        250: '250ms',
      },
    },
  },
  plugins: [],
}
