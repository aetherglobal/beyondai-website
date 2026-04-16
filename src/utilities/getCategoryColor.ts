const categoryColors: Record<string, string> = {
  'ai-policy': 'bg-blue-500',
  ethics: 'bg-emerald-500',
  'digital-rights': 'bg-amber-500',
  research: 'bg-violet-500',
  governance: 'bg-rose-500',
  policy: 'bg-blue-500',
  commentary: 'bg-cyan-500',
  explainer: 'bg-teal-500',
  'event-summary': 'bg-orange-500',
}

export function getCategoryColor(slug: string): string {
  return categoryColors[slug] ?? 'bg-primary'
}
