export function getReadingTime(content: Record<string, unknown> | null | undefined): number {
  if (!content) return 1
  const text = extractText(content)
  const wordCount = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(wordCount / 200))
}

function extractText(node: Record<string, unknown>): string {
  let text = ''
  if (typeof node.text === 'string') text += node.text + ' '
  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      text += extractText(child as Record<string, unknown>)
    }
  }
  if (node.root && typeof node.root === 'object') {
    text += extractText(node.root as Record<string, unknown>)
  }
  return text
}
