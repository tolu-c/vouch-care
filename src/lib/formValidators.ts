export function validateContact(value: string) {
  if (!value.trim()) return 'Phone number or email is required'
  const normalized = value.trim()
  const digitsOnly = normalized.replace(/\D/g, '')
  const looksLikeEmail = normalized.includes('@')
  const looksLikePhone = digitsOnly.length >= 10
  if (!looksLikeEmail && !looksLikePhone) {
    return 'Enter a valid phone number or email'
  }
  return undefined
}

export function validatePassword(value: string) {
  if (!value.trim()) return 'Password is required'
  if (value.length < 6) return 'Password must be at least 6 characters'
  return undefined
}

export function validateConfirmPassword(value: string, password: string) {
  if (!value.trim()) return 'Please confirm your password'
  if (value !== password) return 'Passwords do not match'
  return undefined
}

export function validateHmoId(value: string) {
  if (!value.trim()) return 'HMO ID is required'
  if (value.trim().length < 4) return 'HMO ID must be at least 4 characters'
  return undefined
}

export function validateRequiredSelection(value: string, label: string) {
  if (!value) return `Please select ${label}`
  return undefined
}

export function validateOtpDigit(value: string) {
  if (!value) return 'Required'
  if (!/^\d$/.test(value)) return 'Invalid'
  return undefined
}