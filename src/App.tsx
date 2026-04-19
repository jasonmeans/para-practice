import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { questionBank } from './data/questions'
import {
  exportHistory,
  clearActiveSession,
  clearAllHistory,
  fetchLearnerHistory,
  importHistory,
  saveActiveSession,
  saveAttempt,
} from './lib/backend/historyService'
import {
  type AuthSession,
  getAuthSession,
  signIn,
  signOut,
  signUp,
} from './lib/backend/authService'
import { createQuizSession } from './lib/quiz/engine'
import { scoreSession } from './lib/quiz/scoring'
import { useThemePreference } from './lib/theme'
import { getErrorMessage } from './lib/utils/error'
import type { ActiveSession, Attempt, HistoryExport, QuizConfig } from './types'
import './index.css'
import { AuthPage } from './pages/AuthPage'

const HomePage = lazy(() =>
  import('./pages/HomePage').then((module) => ({ default: module.HomePage }))
)
const PracticePage = lazy(() =>
  import('./pages/PracticePage').then((module) => ({
    default: module.PracticePage,
  }))
)
const HistoryPage = lazy(() =>
  import('./pages/HistoryPage').then((module) => ({
    default: module.HistoryPage,
  }))
)
const InsightsPage = lazy(() =>
  import('./pages/InsightsPage').then((module) => ({
    default: module.InsightsPage,
  }))
)
const ResultsPage = lazy(() =>
  import('./pages/ResultsPage').then((module) => ({
    default: module.ResultsPage,
  }))
)

function downloadJson(filename: string, payload: HistoryExport) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export default function App() {
  const [attempts, setAttempts] = useState<Attempt[]>([])
  const [activeSession, setActiveSession] = useState<
    ActiveSession | undefined
  >()
  const [session, setSession] = useState<AuthSession | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [dataLoading, setDataLoading] = useState(true)
  const [authActionLoading, setAuthActionLoading] = useState(false)
  const [authMessage, setAuthMessage] = useState<string | null>(null)
  const [authError, setAuthError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  useThemePreference()
  const hasHistory = useMemo(() => attempts.length > 0, [attempts])

  const refresh = useCallback(async (userId: string) => {
    setDataLoading(true)

    try {
      const nextState = await fetchLearnerHistory(userId)
      setAttempts(nextState.attempts)
      setActiveSession(nextState.activeSession)
      setSaveError(null)
    } catch (error) {
      setSaveError(getErrorMessage(error))
    } finally {
      setDataLoading(false)
    }
  }, [])

  const loadSessionState = useCallback(async () => {
    setAuthLoading(true)

    try {
      const nextSession = await getAuthSession()
      setSession(nextSession)
      setAuthError(null)

      if (nextSession?.user.id) {
        await refresh(nextSession.user.id)
      } else {
        setAttempts([])
        setActiveSession(undefined)
        setDataLoading(false)
      }
    } catch (error) {
      setAuthError(getErrorMessage(error))
      setAttempts([])
      setActiveSession(undefined)
      setDataLoading(false)
    } finally {
      setAuthLoading(false)
    }
  }, [refresh])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadSessionState()
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [loadSessionState])

  useEffect(() => {
    if (!session?.user.id) {
      return undefined
    }

    const userId = session.user.id

    function handleVisibilitySync() {
      if (document.visibilityState === 'visible') {
        void refresh(userId)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilitySync)
    window.addEventListener('focus', handleVisibilitySync)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilitySync)
      window.removeEventListener('focus', handleVisibilitySync)
    }
  }, [refresh, session?.user.id])

  const handleSignIn = useCallback(
    async (email: string, password: string) => {
      setAuthActionLoading(true)
      setAuthError(null)
      setAuthMessage(null)

      try {
        await signIn(email, password)
        await loadSessionState()
      } catch (error) {
        setAuthError(getErrorMessage(error))
        throw error
      } finally {
        setAuthActionLoading(false)
      }
    },
    [loadSessionState]
  )

  const handleSignUp = useCallback(
    async (email: string, password: string) => {
      setAuthActionLoading(true)
      setAuthError(null)
      setAuthMessage(null)

      try {
        const result = await signUp(email, password)

        setAuthMessage(
          result.sessionCreated
            ? 'Your practice account is ready. Start a set when you are.'
            : 'Check your email to confirm the account, then sign in to keep going.'
        )
        await loadSessionState()
      } catch (error) {
        setAuthError(getErrorMessage(error))
        throw error
      } finally {
        setAuthActionLoading(false)
      }
    },
    [loadSessionState]
  )

  const handleSignOut = useCallback(async () => {
    setAuthMessage(null)
    await signOut()
    await loadSessionState()
    setSaveError(null)
  }, [loadSessionState])

  const handleStartQuiz = useCallback(
    async (config: QuizConfig) => {
      const userId = session?.user.id

      if (!userId) {
        throw new Error('Sign in is required before starting a quiz.')
      }

      const nextSession = createQuizSession(config, questionBank, attempts)
      await saveActiveSession(userId, nextSession)
      setActiveSession(nextSession)
      setSaveError(null)
    },
    [attempts, session?.user.id]
  )

  const handleSessionChange = useCallback(
    async (nextSession: ActiveSession) => {
      const userId = session?.user.id

      if (!userId) {
        throw new Error('Sign in is required before saving progress.')
      }

      setActiveSession(nextSession)

      try {
        await saveActiveSession(userId, nextSession)
        setSaveError(null)
      } catch (error) {
        setSaveError(
          `${getErrorMessage(error)} Your latest change has not been saved by the app yet.`
        )
        throw error
      }
    },
    [session?.user.id]
  )

  const handleSubmitSession = useCallback(
    async (activeQuizSession: ActiveSession) => {
      const userId = session?.user.id

      if (!userId) {
        throw new Error('Sign in is required before submitting an attempt.')
      }

      const attempt = scoreSession(
        activeQuizSession,
        new Map(questionBank.map((item) => [item.id, item]))
      )

      await saveAttempt(userId, attempt)
      await clearActiveSession(userId)
      await refresh(userId)
      return attempt
    },
    [refresh, session?.user.id]
  )

  const handleExportHistory = useCallback(async () => {
    const payload = exportHistory(attempts, activeSession)
    downloadJson('para-practice-history.json', payload)
  }, [activeSession, attempts])

  const handleImportHistory = useCallback(
    async (file: File) => {
      const userId = session?.user.id

      if (!userId) {
        throw new Error('Sign in is required before importing history.')
      }

      const text = await file.text()
      const payload = JSON.parse(text)
      await importHistory(userId, payload)
      await refresh(userId)
    },
    [refresh, session?.user.id]
  )

  const handleClearHistory = useCallback(async () => {
    const userId = session?.user.id

    if (!userId) {
      throw new Error('Sign in is required before clearing history.')
    }

    await clearAllHistory(userId)
    setAttempts([])
    setActiveSession(undefined)
    setSaveError(null)
  }, [session?.user.id])

  if (authLoading || (session && dataLoading)) {
    return (
      <div className="app-shell">
        <section className="page-band">
          <div className="shell-inner empty-state">
            <h1>Preparing Dove&apos;s study space...</h1>
          </div>
        </section>
      </div>
    )
  }

  if (!session) {
    return (
      <AuthPage
        loading={authActionLoading}
        message={authMessage}
        error={authError}
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
      />
    )
  }

  return (
    <HashRouter>
      <AppLayout
        activeSession={activeSession}
        notice={saveError}
        userEmail={session.user.email ?? 'Signed in'}
        onSignOut={handleSignOut}
      >
        <Suspense
          fallback={
            <section className="page-band">
              <div className="shell-inner empty-state">
                <h1>Loading study workspace...</h1>
              </div>
            </section>
          }
        >
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  attempts={attempts}
                  activeSession={activeSession}
                  onStartQuiz={handleStartQuiz}
                />
              }
            />
            <Route
              path="/practice"
              element={
                <PracticePage
                  activeSession={activeSession}
                  onSessionChange={handleSessionChange}
                  onSubmitSession={handleSubmitSession}
                />
              }
            />
            <Route
              path="/history"
              element={
                <HistoryPage
                  attempts={attempts}
                  onClearHistory={handleClearHistory}
                  onExportHistory={handleExportHistory}
                  onImportHistory={handleImportHistory}
                />
              }
            />
            <Route
              path="/insights"
              element={<InsightsPage attempts={attempts} />}
            />
            <Route
              path="/results/:attemptId"
              element={
                hasHistory ? (
                  <ResultsPage
                    attempts={attempts}
                    onStartQuiz={handleStartQuiz}
                  />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AppLayout>
    </HashRouter>
  )
}
