import type { SiteSetting } from '@/payload-types'

const camelToKebab = (s: string): string => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)

const SAFE_CSS_VALUE = /^[#a-zA-Z0-9(),.%\s/\-]+$/

const isSafeCssValue = (value: string): boolean =>
  SAFE_CSS_VALUE.test(value) && !/[<>;{}@]/.test(value)

export function getThemeStyle(settings: SiteSetting | null): string {
  const theme = settings?.theme
  if (!theme) return ''

  const declarations: string[] = []

  if (theme.colors) {
    for (const [key, value] of Object.entries(theme.colors)) {
      if (typeof value === 'string' && value.trim() && isSafeCssValue(value.trim())) {
        declarations.push(`--${camelToKebab(key)}: ${value.trim()};`)
      }
    }
  }

  const radius = Number(theme.layout?.radius)
  if (Number.isFinite(radius)) {
    declarations.push(`--radius: ${radius}px;`)
  }

  const containerMax = Number(theme.layout?.containerMaxWidth)
  if (Number.isFinite(containerMax)) {
    declarations.push(`--container-max: ${containerMax}px;`)
  }

  if (declarations.length === 0) return ''

  return `:root { ${declarations.join(' ')} }`
}
