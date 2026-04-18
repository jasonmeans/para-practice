import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { Session } from '@supabase/supabase-js'
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
import { createQuizSession } from './lib/quiz/engine'
import { scoreSession } from './lib/quiz/scoring'
import { hasSupabaseConfig, supabase } from './lib/supabase/client'
import { useThemePreference } from './lib/theme'
import { getErrorMessage } from './lib/utils/error'
import type { ActiveSession, Attempt, HistoryExport, QuizConfig } from './types'
import './index.css'
import { AuthPage } from './pages/AuthPage'
import { SetupPage } from './pages/SetupPage'

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
  const [session, setSession] = useState<Session | null>(null)
  const [authLoading, setAuthLoading] = useState(hasSupabaseConfig)
  const [dataLoading, setDataLoading] = useState(hasSupabaseConfig)
  const [authActionLoading, setAuthActionLoading] = useState(false)
  const [authMessage, setAuthMessage] = useState<string | null>(null)
  const [authError, setAuthError] = useState<string | null>(null)
  const [syncError, setSyncError] = useState<string | null>(null)
  const { preference, setPreference } = useThemePreference()
  const hasHistory = useMemo(() => attempts.length > 0, [attempts])

  const refresh = useCallback(async (userId: string) => {
    setDataLoading(true)

    try {
      const nextState = await fetchLearnerHistory(userId)
      setAttempts(nextState.attempts)
      setActiveSession(nextState.activeSession)
      setSyncError(null)
    } catch (error) {
      setSyncError(getErrorMessage(error))
    } finally {
      setDataLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!supabase) {
      return undefined
    }

    let mounted = true

    void (async () => {
      const {
        data: { session: nextSession },
        error,
      } = await supabase.auth.getSession()

      if (!mounted) {
        return
      }

      if (error) {
        setAuthError(getErrorMessage(error))
      }

      setSession(nextSession)
      setAuthLoading(false)

      if (nextSession?.user.id) {
        await refresh(nextSession.user.id)
      } else {
        setAttempts([])
        setActiveSession(undefined)
        setDataLoading(false)
      }
    })()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setAuthError(null)

      if (nextSession?.user.id) {
        void refresh(nextSession.user.id)
      } else {
        setAttempts([])
        setActiveSession(undefined)
        setDataLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [refresh])

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

  const handleSignIn = useCallback(async (email: string, password: string) => {
    if (!supabase) {
      return
    }

    setAuthActionLoading(true)
    setAuthError(null)
    setAuthMessage(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }
    } catch (error) {
      setAuthError(getErrorMessage(error))
      throw error
    } finally {
      setAuthActionLoading(false)
    }
  }, [])

  const handleSignUp = useCallback(async (email: string, password: string) => {
    if (!supabase) {
      return
    }

    setAuthActionLoading(true)
    setAuthError(null)
    setAuthMessage(null)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            learner_name: 'Dove',
          },
        },
      })

      if (error) {
        throw error
      }

      setAuthMessage(
        data.session
          ? 'Your sync account is ready. Start a practice set when you are.'
          : 'Check your email to confirm the account, then sign in to start syncing.'
      )
    } catch (error) {
      setAuthError(getErrorMessage(error))
      throw error
    } finally {
      setAuthActionLoading(false)
    }
  }, [])

  const handleSignOut = useCallback(async () => {
    if (!supabase) {
      return
    }

    await supabase.auth.signOut()
    setAttempts([])
    setActiveSession(undefined)
    setSyncError(null)
  }, [])

  const handleStartQuiz = useCallback(
    async (config: QuizConfig) => {
      const userId = session?.user.id

      if (!userId) {
        throw new Error('Sign in is required before starting a quiz.')
      }

      const nextSession = createQuizSession(config, questionBank, attempts)
      await saveActiveSession(userId, nextSession)
      setActiveSession(nextSession)
      setSyncError(null)
    },
    [attempts, session?.user.id]
  )

  const handleSessionChange = useCallback(
    async (nextSession: ActiveSession) => {
      const userId = session?.user.id

      if (!userId) {
        throw new Error('Sign in is required before syncing progress.')
      }

      setActiveSession(nextSession)

      try {
        await saveActiveSession(userId, nextSession)
        setSyncError(null)
      } catch (error) {
        setSyncError(
          `${getErrorMessage(error)} Your latest change has not been confirmed by the backend yet.`
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
    setSyncError(null)
  }, [session?.user.id])

  if (!hasSupabaseConfig) {
    return <SetupPage />
  }

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
        attemptCount={attempts.length}
        notice={syncError}
        userEmail={session.user.email ?? 'Signed in'}
        themePreference={preference}
        onThemeChange={setPreference}
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
