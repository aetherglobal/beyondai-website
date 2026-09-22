export function isObject(item: unknown): item is Record<string, unknown> {
  return typeof item === 'object' && item !== null && !Array.isArray(item)
}

export default function deepMerge<T, R>(target: T, source: R): T {
  if (!isObject(target) || !isObject(source)) return target

  const output: Record<string, unknown> = { ...target }

  for (const key of Object.keys(source)) {
    const value = source[key]
    output[key] =
      isObject(value) && isObject(output[key]) ? deepMerge(output[key], value) : value
  }

  return output as T
}
