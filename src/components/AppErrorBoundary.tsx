import { Component, type ReactNode } from 'react'

interface AppErrorBoundaryProps {
  children: ReactNode
}

interface AppErrorBoundaryState {
  hasError: boolean
}

export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = {
    hasError: false,
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    console.error('App render failure', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main
          style={{
            minHeight: '100vh',
            display: 'grid',
            placeItems: 'center',
            padding: '1.5rem',
            fontFamily:
              "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            background: '#f3f5f7',
            color: '#1d2733',
          }}
        >
          <section
            style={{
              width: 'min(40rem, 100%)',
              border: '1px solid rgba(103, 122, 140, 0.2)',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.92)',
              padding: '1.25rem',
            }}
          >
            <p
              style={{
                margin: 0,
                color: '#bf694d',
                fontSize: '0.82rem',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              Something went wrong
            </p>
            <h1 style={{ marginBottom: '0.75rem' }}>
              The page hit a snag before it could load.
            </h1>
            <p style={{ marginTop: 0, color: '#5b6978' }}>
              Try refreshing once. If the problem keeps showing up, the app is
              now set up to fail more gracefully while we track down the cause.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{
                border: '1px solid rgba(103, 122, 140, 0.2)',
                borderRadius: '8px',
                background: '#ffffff',
                color: '#1d2733',
                padding: '0.7rem 1rem',
                font: 'inherit',
              }}
            >
              Reload page
            </button>
          </section>
        </main>
      )
    }

    return this.props.children
  }
}
