import { useState } from 'react'
import { DOVE_PORTRAIT_IMAGE } from '../data/constants'
import { getErrorMessage } from '../lib/utils/error'

interface AuthPageProps {
  loading: boolean
  message?: string | null
  error?: string | null
  onSignIn: (email: string, password: string) => Promise<void>
  onSignUp: (email: string, password: string) => Promise<void>
}

export function AuthPage({
  loading,
  message,
  error,
  onSignIn,
  onSignUp,
}: AuthPageProps) {
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLocalError(null)

    try {
      if (mode === 'sign-in') {
        await onSignIn(email, password)
      } else {
        await onSignUp(email, password)
      }
    } catch (submitError) {
      setLocalError(getErrorMessage(submitError))
    }
  }

  return (
    <section className="page-band auth-band">
      <div className="shell-inner auth-layout">
        <div className="auth-copy">
          <p className="eyebrow">For Dove</p>
          <h1>A calm, steady place to finish strong.</h1>
          <p className="lede">
            Sign in once and your progress, results, and saved test sessions
            stay ready when you come back.
          </p>
          <p className="storage-note">
            Practice history is stored by the app for this account. Only your
            sign-in session stays in the browser.
          </p>
        </div>

        <div className="auth-panel">
          <figure className="auth-photo">
            <img
              src={DOVE_PORTRAIT_IMAGE}
              alt="Close-up portrait of a white dove against a soft sky"
            />
          </figure>

          <div className="auth-card">
            <div className="auth-mode">
              <button
                type="button"
                className={
                  mode === 'sign-in'
                    ? 'auth-mode__button is-active'
                    : 'auth-mode__button'
                }
                onClick={() => setMode('sign-in')}
              >
                Sign in
              </button>
              <button
                type="button"
                className={
                  mode === 'sign-up'
                    ? 'auth-mode__button is-active'
                    : 'auth-mode__button'
                }
                onClick={() => setMode('sign-up')}
              >
                Create account
              </button>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <label className="field">
                <span>Email</span>
                <input
                  className="text-input"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="dove@example.com"
                  autoComplete="email"
                  required
                />
              </label>

              <label className="field">
                <span>Password</span>
                <input
                  className="text-input"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 8 characters"
                  autoComplete={
                    mode === 'sign-up' ? 'new-password' : 'current-password'
                  }
                  minLength={8}
                  required
                />
              </label>

              {message ? <p className="form-message">{message}</p> : null}
              {error || localError ? (
                <p className="form-message form-message--error">
                  {error ?? localError}
                </p>
              ) : null}

              <button
                type="submit"
                className="button button--primary button--full"
                disabled={loading}
              >
                {loading
                  ? 'Working...'
                  : mode === 'sign-in'
                    ? 'Sign in'
                    : 'Create account'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
