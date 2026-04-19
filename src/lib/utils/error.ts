export function getErrorMessage(error: unknown) {
  if (typeof error === 'string') {
    return normalizeErrorMessage(error)
  }

  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return normalizeErrorMessage(error.message)
  }

  return 'Something went wrong. Please try again.'
}

function normalizeErrorMessage(message: string) {
  if (
    message === 'Load failed' ||
    message === 'Failed to fetch' ||
    message === 'NetworkError when attempting to fetch resource.'
  ) {
    return 'The saved-progress service is temporarily unavailable. Please refresh and try again in a moment.'
  }

  return message
}
