import { NavLink } from 'react-router-dom'
import { APP_SUBTITLE, APP_TITLE } from '../data/constants'
import type { ActiveSession } from '../types'

interface AppLayoutProps {
  activeSession?: ActiveSession
  notice?: string | null
  userEmail: string
  onSignOut: () => Promise<void>
  children: React.ReactNode
}

export function AppLayout({
  activeSession,
  notice,
  userEmail,
  onSignOut,
  children,
}: AppLayoutProps) {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="shell-inner site-header__inner">
          <div className="site-header__brand">
            <NavLink to="/" className="site-title">
              {APP_TITLE}
            </NavLink>
            <p className="site-header__note">{APP_SUBTITLE}</p>
          </div>

          <nav className="primary-nav" aria-label="Primary">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? 'nav-link is-active' : 'nav-link'
              }
              end
            >
              Home
            </NavLink>
            <NavLink
              to="/history"
              className={({ isActive }) =>
                isActive ? 'nav-link is-active' : 'nav-link'
              }
            >
              History
            </NavLink>
            <NavLink
              to="/insights"
              className={({ isActive }) =>
                isActive ? 'nav-link is-active' : 'nav-link'
              }
            >
              Insights
            </NavLink>
            {activeSession ? (
              <NavLink
                to="/practice"
                className={({ isActive }) =>
                  isActive ? 'nav-link is-active' : 'nav-link'
                }
              >
                Resume
              </NavLink>
            ) : null}
          </nav>

          <div className="site-header__meta">
            <span className="meta-pill meta-pill--active">
              {activeSession ? 'Saved + resume ready' : 'Progress saved'}
            </span>
            <span className="meta-pill meta-pill--email" title={userEmail}>
              {userEmail}
            </span>
            <button
              type="button"
              className="button button--ghost"
              onClick={() => void onSignOut()}
            >
              Sign out
            </button>
          </div>
        </div>
        {notice ? (
          <div className="shell-inner notice-banner" role="status">
            {notice}
          </div>
        ) : null}
      </header>

      <main>{children}</main>
    </div>
  )
}
