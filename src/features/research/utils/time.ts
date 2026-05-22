/**
 * Returns a human-readable relative time string for any ISO timestamp.
 * Stays concise: "just now", "4m ago", "2h ago", "yesterday", "3d ago", "May 3".
 */
export function formatRelativeTime(isoString: string): string {
  const diffSeconds = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000)

  if (diffSeconds < 60)     return 'just now'
  if (diffSeconds < 3_600)  return `${Math.floor(diffSeconds / 60)}m ago`
  if (diffSeconds < 86_400) return `${Math.floor(diffSeconds / 3_600)}h ago`

  const days = Math.floor(diffSeconds / 86_400)
  if (days === 1) return 'yesterday'
  if (days < 7)   return `${days}d ago`

  return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
