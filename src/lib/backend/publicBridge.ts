const GITHUB_PAGES_HOST = 'jasonmeans.github.io'
const GITHUB_PAGES_BASE_PATH = '/para-practice/'

// Current Cloudflare quick tunnel for the published Pages build while the local
// backend remains the active hosted path. Prefer Vite env overrides when they
// are available so deploys can recover from tunnel rotation without code edits.
const PAGES_BRIDGE_API_BASE_URL =
  'https://depend-sentences-visible-proxy.trycloudflare.com'

export function resolveLocalApiBaseUrl(explicitUrl?: string) {
  const normalizedExplicitUrl = explicitUrl?.replace(/\/+$/, '') ?? ''

  if (normalizedExplicitUrl) {
    return normalizedExplicitUrl
  }

  if (typeof window === 'undefined') {
    return ''
  }

  const isGitHubPagesDeployment =
    window.location.host === GITHUB_PAGES_HOST &&
    window.location.pathname.startsWith(GITHUB_PAGES_BASE_PATH)

  if (isGitHubPagesDeployment) {
    return PAGES_BRIDGE_API_BASE_URL
  }

  return ''
}
