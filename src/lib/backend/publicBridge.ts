const GITHUB_PAGES_HOST = 'jasonmeans.github.io'
const GITHUB_PAGES_BASE_PATH = '/para-practice/'

// Fixed bridge for the published Pages build while the local backend remains
// the active hosted path.
const PAGES_BRIDGE_API_BASE_URL = 'https://para-practice-jasonmeans.loca.lt'

export function resolveLocalApiBaseUrl(explicitUrl?: string) {
  const normalizedExplicitUrl = explicitUrl?.replace(/\/+$/, '') ?? ''

  if (typeof window === 'undefined') {
    return normalizedExplicitUrl
  }

  const isGitHubPagesDeployment =
    window.location.host === GITHUB_PAGES_HOST &&
    window.location.pathname.startsWith(GITHUB_PAGES_BASE_PATH)

  if (isGitHubPagesDeployment) {
    return PAGES_BRIDGE_API_BASE_URL
  }

  return normalizedExplicitUrl
}
