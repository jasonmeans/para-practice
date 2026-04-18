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
  clearActiveSession,
  clearAllHistory,
  exportHistory,
  getActiveSession,
  getAttempts,
  importHistory,
  saveActiveSession,
  saveAttempt,
} from './lib/db/historyService'
import { createQuizSession } from './lib/quiz/engine'
import { scoreSession } from './lib/quiz/scoring'
import type { ActiveSession, Attempt, HistoryExport, QuizConfig } from './types'
import './index.css'

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
  const [loading, setLoading] = useState(true)
  const hasHistory = useMemo(() => attempts.length > 0, [attempts])

  const refresh = useCallback(async () => {
    const [nextAttempts, nextSession] = await Promise.all([
      getAttempts(),
      getActiveSession(),
    ])
    setAttempts(nextAttempts)
    setActiveSession(nextSession)
  }, [])

  useEffect(() => {
    void (async () => {
      setLoading(true)
      await refresh()
      setLoading(false)
    })()
  }, [refresh])

  const handleStartQuiz = useCallback(
    async (config: QuizConfig) => {
      const session = createQuizSession(config, questionBank, attempts)
      await saveActiveSession(session)
      setActiveSession(session)
    },
    [attempts]
  )

  const handleSessionChange = useCallback(async (session: ActiveSession) => {
    await saveActiveSession(session)
    setActiveSession(session)
  }, [])

  const handleSubmitSession = useCallback(
    async (session: ActiveSession) => {
      const attempt = scoreSession(
        session,
        new Map(questionBank.map((item) => [item.id, item]))
      )
      await saveAttempt(attempt)
      await clearActiveSession()
      await refresh()
      return attempt
    },
    [refresh]
  )

  const handleExportHistory = useCallback(async () => {
    const payload = await exportHistory()
    downloadJson('para-practice-history.json', payload)
  }, [])

  const handleImportHistory = useCallback(
    async (file: File) => {
      const text = await file.text()
      const payload = JSON.parse(text) as HistoryExport
      await importHistory(payload)
      await refresh()
    },
    [refresh]
  )

  const handleClearHistory = useCallback(async () => {
    await clearAllHistory()
    setAttempts([])
    setActiveSession(undefined)
  }, [])

  if (loading) {
    return (
      <div className="app-shell">
        <section className="page-band">
          <div className="shell-inner empty-state">
            <h1>Loading your local study data...</h1>
          </div>
        </section>
      </div>
    )
  }

  return (
    <HashRouter>
      <AppLayout activeSession={activeSession} attemptCount={attempts.length}>
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
