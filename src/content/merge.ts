import { DEFAULT_CONTENT } from './defaults'
import type { SiteContent } from './types'

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function hasId(item: unknown): item is { id: string } {
  return isPlainObject(item) && typeof item.id === 'string'
}

export function mergeContent(overlay: unknown): SiteContent {
  const merged = !isPlainObject(overlay) ? structuredClone(DEFAULT_CONTENT) : structuredClone(deepMerge(DEFAULT_CONTENT, overlay))
  if (!merged.minimumHours || merged.minimumHours < 4) merged.minimumHours = 4
  return merged
}

function deepMerge<T>(base: T, overlay: unknown): T {
  if (!isPlainObject(base) || !isPlainObject(overlay)) {
    return (overlay === undefined ? base : overlay) as T
  }

  const result: Record<string, unknown> = { ...base }
  for (const [key, overlayVal] of Object.entries(overlay)) {
    if (overlayVal === undefined) continue
    const baseVal = result[key]
    if (key === 'vehicles' && Array.isArray(overlayVal) && Array.isArray(baseVal)) {
      const present = new Set(overlayVal.filter(hasId).map((item) => item.id))
      const missing = baseVal.filter((item) => hasId(item) && !present.has(item.id))
      result[key] = [...overlayVal, ...missing]
      continue
    }
    if (Array.isArray(overlayVal)) result[key] = overlayVal
    else if (isPlainObject(overlayVal) && isPlainObject(baseVal)) result[key] = deepMerge(baseVal, overlayVal)
    else result[key] = overlayVal
  }
  return result as T
}
