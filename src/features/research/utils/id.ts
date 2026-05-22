/** Generates a cryptographically random UUID. Available in all modern browsers. */
export function generateId(): string {
  return crypto.randomUUID()
}
