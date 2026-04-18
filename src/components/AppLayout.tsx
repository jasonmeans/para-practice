import { NavLink } from 'react-router-dom'
import { APP_SUBTITLE, APP_TITLE } from '../data/constants'
import type { ActiveSession, ThemePreference } from '../types'
import { ThemeToggle } from './ThemeToggle'

interface AppLayoutProps {
  activeSession?: ActiveSession
  attemptCount: number
  notice?: string | null
  userEmail: string
  themePreference: ThemePreference
  onThemeChange: (preference: ThemePreference) => void
  onSignOut: () => Promise<void>
  children: React.ReactNode
}

export function AppLayout({
  activeSession,
  attemptCount,
  notice,
  userEmail,
  themePreference,
  onThemeChange,
  onSignOut,
  children,
}: AppLayoutProps) {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="shell-inner site-header__inner">
          <div>
            <p className="eyebrow">For Dove · unofficial original study aid</p>
            <NavLink to="/" className="site-title">
              {APP_TITLE}
            </NavLink>
            <p className="site-subtitle">{APP_SUBTITLE}</p>
          </div>

          <div className="site-header__controls">
            <ThemeToggle
              preference={themePreference}
              onChange={onThemeChange}
            />
            <div className="site-header__meta">
              <span className="meta-pill meta-pill--active">
                Synced across devices
              </span>
              <span className="meta-pill">{attemptCount} attempts saved</span>
              {activeSession ? (
                <span className="meta-pill meta-pill--active">
                  Resume available
                </span>
              ) : null}
              <span className="meta-pill">{userEmail}</span>
              <button
                type="button"
                className="button button--ghost"
                onClick={() => void onSignOut()}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>

        <nav className="shell-inner primary-nav" aria-label="Primary">
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
            Study Insights
          </NavLink>
          {activeSession ? (
            <NavLink
              to="/practice"
              className={({ isActive }) =>
                isActive ? 'nav-link is-active' : 'nav-link'
              }
            >
              Resume Practice
            </NavLink>
          ) : null}
        </nav>
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
