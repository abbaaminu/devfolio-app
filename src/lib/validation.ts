const MAX_TEXT_LENGTH = 10_000

export function requiredText(value: string, field: string, maxLength = MAX_TEXT_LENGTH): string {
  const normalized = value.trim()
  if (!normalized) throw new Error(`${field} is required.`)
  if (normalized.length > maxLength) throw new Error(`${field} is too long.`)
  return normalized
}

export function optionalText(value: string, maxLength = MAX_TEXT_LENGTH): string | null {
  const normalized = value.trim()
  return normalized ? normalized.slice(0, maxLength) : null
}

export function validateEmail(value: string): string {
  const email = requiredText(value, 'Email', 254).toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Enter a valid email address.')
  return email
}

export function validatePassword(value: string): string {
  if (value.length < 8) throw new Error('Password must be at least 8 characters.')
  if (value.length > 128) throw new Error('Password is too long.')
  return value
}

export function optionalUrl(value: string): string | null {
  const normalized = optionalText(value, 2_048)
  if (!normalized) return null
  try {
    const url = new URL(normalized)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') throw new Error()
    return url.toString()
  } catch {
    throw new Error('Enter a valid HTTP or HTTPS URL.')
  }
}

export function getErrorMessage(error: unknown, fallback = 'Something went wrong.'): string {
  if (error instanceof Error && error.message) return error.message
  return fallback
}
