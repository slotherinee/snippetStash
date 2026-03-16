/** Strips HTML tags to prevent stored XSS in plain-text fields */
export function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '')
}

/** Clamp string to max length */
export function clampStr(str: string, max: number): string {
  return str.slice(0, max)
}

export interface PostValidation {
  ok: boolean
  errors: string[]
}

export function validatePost(data: {
  title: string
  description: string
  code: string
}): PostValidation {
  const errors: string[] = []

  if (!data.title.trim())                errors.push('Title is required.')
  if (data.title.trim().length < 3)      errors.push('Title must be at least 3 characters.')
  if (data.title.length > 120)           errors.push('Title must be 120 characters or less.')

  if (!data.description.trim())          errors.push('Description is required.')
  if (data.description.length > 2000)    errors.push('Description must be 2 000 characters or less.')

  if (!data.code.trim())                 errors.push('Code is required.')
  if (data.code.length > 100_000)        errors.push('Code must be under 100 000 characters.')

  return { ok: errors.length === 0, errors }
}

export function validateComment(text: string): PostValidation {
  const errors: string[] = []

  if (!text.trim())           errors.push('Comment cannot be empty.')
  if (text.trim().length < 2) errors.push('Comment must be at least 2 characters.')
  if (text.length > 2000)     errors.push('Comment must be 2 000 characters or less.')

  return { ok: errors.length === 0, errors }
}

/** Basic URL validation — must start with https:// */
export function isHttpsUrl(url: string): boolean {
  try {
    const u = new URL(url)
    return u.protocol === 'https:'
  } catch {
    return false
  }
}
