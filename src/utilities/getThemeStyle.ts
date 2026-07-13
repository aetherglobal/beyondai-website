import type { SiteSetting } from '@/payload-types'

const camelToKebab = (s: string): string => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)

export function getThemeStyle(settings: SiteSetting | null): string {
  const theme = settings?.theme
  if (!theme) return ''

  const declarations: string[] = []

  if (theme.colors) {
    for (const [key, value] of Object.entries(theme.colors)) {
      if (typeof value === 'string' && value.trim()) {
        declarations.push(`--${camelToKebab(key)}: ${value.trim()};`)
      }
    }
  }

  if (theme.layout?.radius != null) {
    declarations.push(`--radius: ${theme.layout.radius}px;`)
  }

  if (theme.layout?.containerMaxWidth != null) {
    declarations.push(`--container-max: ${theme.layout.containerMaxWidth}px;`)
  }

  // Typography is fixed to Clash Grotesk site-wide (see globals.css); the Site
  // Settings font selectors are intentionally not applied here.

  if (declarations.length === 0) return ''

  return `:root { ${declarations.join(' ')} }`
}
