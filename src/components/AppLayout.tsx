import { NavLink } from 'react-router-dom'
import { APP_TITLE } from '../data/constants'
import type { ActiveSession } from '../types'

interface AppLayoutProps {
  activeSession?: ActiveSession
  attemptCount: number
  children: React.ReactNode
}

export function AppLayout({
  activeSession,
  attemptCount,
  children,
}: AppLayoutProps) {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="shell-inner site-header__inner">
          <div>
            <p className="eyebrow">Unofficial original study aid</p>
            <NavLink to="/" className="site-title">
              {APP_TITLE}
            </NavLink>
            <p className="site-subtitle">
              ParaPro (1755) practice tests, section drills, history, and study
              insights
            </p>
          </div>

          <div className="site-header__meta">
            <span className="meta-pill">{attemptCount} attempts saved</span>
            {activeSession ? (
              <span className="meta-pill meta-pill--active">
                Resume available
              </span>
            ) : null}
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
      </header>

      <main>{children}</main>
    </div>
  )
}
