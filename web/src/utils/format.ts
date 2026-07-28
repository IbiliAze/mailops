////////////////////////////////////////////////////////////////////////////////////////??
// Presentation-only helpers. Nothing here talks to the API or mutates app state.
////////////////////////////////////////////////////////////////////////////////////////??

const AVATAR_COLORS = ['azure', 'lagoon', 'indigo', 'violet', 'grape', 'teal', 'cyan', 'blue']

/** "Ada Lovelace <ada@mail.com>" -> "Ada Lovelace" (falls back to the address). */
export function displayName(value?: string | null) {
  if (!value) return ''

  const named = value.match(/^\s*"?([^"<]+?)"?\s*<[^>]+>\s*$/)
  if (named?.[1]) return named[1].trim()

  return value.replace(/[<>]/g, '').trim()
}

/** First letters of the sender name / address, used for the row avatars. */
export function initials(value?: string | null) {
  const name = displayName(value)
  if (!name) return '?'

  const parts = name.split(/[\s._@-]+/).filter(Boolean)
  if (!parts.length) return name.slice(0, 2).toUpperCase()

  return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase()
}

/** Stable pseudo-random theme color for a given string, so a sender always looks the same. */
export function colorFor(value?: string | null) {
  const seed = value || ''
  let hash = 0

  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) % 100000

  return AVATAR_COLORS[hash % AVATAR_COLORS.length]
}

/** "3m ago" / "5h ago" / "2d ago", falling back to a locale date for anything older. */
export function relativeTime(value?: string | null) {
  if (!value) return '—'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'

  const seconds = Math.round((Date.now() - date.getTime()) / 1000)

  if (seconds < 45) return 'just now'
  if (seconds < 3600) return `${Math.round(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.round(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.round(seconds / 86400)}d ago`

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

/** Full timestamp for tooltips and detail rows. */
export function fullDate(value?: string | null) {
  if (!value) return '—'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'

  return date.toLocaleString()
}

/** Numbers arrive as strings from some endpoints — normalise before rendering. */
export function toNumber(value: unknown) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

