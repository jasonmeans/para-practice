import { useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { STORAGE_NOTE } from '../data/constants'
import { analyzeAttempts } from '../lib/insights/analyze'
import { getErrorMessage } from '../lib/utils/error'
import { formatDateTime, formatPercent } from '../lib/utils/format'
import type { Attempt } from '../types'

interface HistoryPageProps {
  attempts: Attempt[]
  onClearHistory: () => Promise<void>
  onExportHistory: () => Promise<void>
  onImportHistory: (file: File) => Promise<void>
}

export function HistoryPage({
  attempts,
  onClearHistory,
  onExportHistory,
  onImportHistory,
}: HistoryPageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const insights = useMemo(() => analyzeAttempts(attempts), [attempts])

  const trendData = useMemo(
    () =>
      [...attempts]
        .sort(
          (left, right) =>
            new Date(left.completedAt).getTime() -
            new Date(right.completedAt).getTime()
        )
        .map((attempt, index) => ({
          label: `A${index + 1}`,
          score: Math.round(attempt.percentCorrect),
          reading: Math.round(
            attempt.sectionBreakdown.find((row) => row.section === 'reading')
              ?.percent ?? 0
          ),
          writing: Math.round(
            attempt.sectionBreakdown.find((row) => row.section === 'writing')
              ?.percent ?? 0
          ),
          math: Math.round(
            attempt.sectionBreakdown.find((row) => row.section === 'math')
              ?.percent ?? 0
          ),
          instructionalSupport: Math.round(
            attempt.sectionBreakdown.find(
              (row) => row.section === 'instructional-support'
            )?.percent ?? 0
          ),
        })),
    [attempts]
  )

  async function clearAll() {
    const confirmed = window.confirm(
      'Clear all saved attempts and any saved in-progress session for this account?'
    )

    if (!confirmed) {
      return
    }

    try {
      await onClearHistory()
    } catch (error) {
      window.alert(getErrorMessage(error))
    }
  }

  return (
    <>
      <section className="page-band page-band--intro">
        <div className="shell-inner two-column-band">
          <div>
            <p className="eyebrow">Saved progress</p>
            <h1>History and trends</h1>
            <p className="lede">{STORAGE_NOTE}</p>
          </div>

          <div className="metric-row">
            <div className="metric-card">
              <span className="metric-label">Average</span>
              <strong>{formatPercent(insights.overallAverage)}</strong>
            </div>
            <div className="metric-card">
              <span className="metric-label">Best</span>
              <strong>{formatPercent(insights.bestScore)}</strong>
            </div>
            <div className="metric-card">
              <span className="metric-label">Recent</span>
              <strong>{formatPercent(insights.recentAverage)}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="page-band">
        <div className="shell-inner history-actions">
          <button
            type="button"
            className="button button--primary"
            onClick={() =>
              void onExportHistory().catch((error) =>
                window.alert(getErrorMessage(error))
              )
            }
            disabled={attempts.length === 0}
          >
            Export history JSON
          </button>
          <button
            type="button"
            className="button button--secondary"
            onClick={() => fileInputRef.current?.click()}
          >
            Import history JSON
          </button>
          <button
            type="button"
            className="button button--danger"
            onClick={() => void clearAll()}
            disabled={attempts.length === 0}
          >
            Clear saved history
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0]

              if (file) {
                void onImportHistory(file).catch((error) =>
                  window.alert(getErrorMessage(error))
                )
                event.target.value = ''
              }
            }}
          />
        </div>
      </section>

      {attempts.length > 0 ? (
        <>
          <section className="page-band">
            <div className="shell-inner chart-grid">
              <div className="chart-panel">
                <h2>Total score trend</h2>
                <div className="chart-shell">
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={trendData}>
                      <XAxis dataKey="label" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#1f6a5b"
                        strokeWidth={3}
                        dot={{ r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="chart-panel">
                <h2>Section trends</h2>
                <div className="chart-shell">
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={trendData}>
                      <XAxis dataKey="label" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="reading"
                        stroke="#1f6a5b"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="writing"
                        stroke="#b4573f"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="math"
                        stroke="#b88c1a"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="instructionalSupport"
                        stroke="#55636f"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </section>

          <section className="page-band">
            <div className="shell-inner">
              <h2>Attempts</h2>
              <div className="table-wrap">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th scope="col">Date</th>
                      <th scope="col">Mode</th>
                      <th scope="col">Questions</th>
                      <th scope="col">Score</th>
                      <th scope="col">Weak topics</th>
                      <th scope="col">Review</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attempts.map((attempt) => (
                      <tr key={attempt.id}>
                        <td>{formatDateTime(attempt.completedAt)}</td>
                        <td>{attempt.title}</td>
                        <td>{attempt.count}</td>
                        <td>{formatPercent(attempt.percentCorrect)}</td>
                        <td>
                          {attempt.weakTopics.slice(0, 2).join(', ') ||
                            'None noted'}
                        </td>
                        <td>
                          <Link to={`/results/${attempt.id}`}>
                            View details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </>
      ) : (
        <section className="page-band">
          <div className="shell-inner empty-state">
            <h2>No attempts yet</h2>
            <p>
              Take a short quiz to start building your saved trend history.
            </p>
          </div>
        </section>
      )}
    </>
  )
}
