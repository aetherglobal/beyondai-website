import type { SiteSetting } from '@/payload-types'
import { getCachedGlobal } from './getGlobals'

const camelToKebab = (s: string): string => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)

export async function getThemeStyle(): Promise<string> {
  const settings = (await getCachedGlobal('site-settings', 0)()) as SiteSetting | null

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

  if (theme.typography?.fontSans) {
    declarations.push(`--font-sans: var(--font-${theme.typography.fontSans});`)
  }

  if (theme.typography?.fontMono) {
    declarations.push(`--font-mono: var(--font-${theme.typography.fontMono});`)
  }

  if (declarations.length === 0) return ''

  return `:root { ${declarations.join(' ')} }`
}
