import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  DOVE_HERO_IMAGE,
  FOCUSED_QUIZ_COUNT_OPTIONS,
  FULL_TEST_COUNT_OPTIONS,
  SECTION_LABELS,
  SECTION_QUIZ_COUNT_OPTIONS,
  STORAGE_NOTE,
} from '../data/constants'
import { analyzeAttempts } from '../lib/insights/analyze'
import { getErrorMessage } from '../lib/utils/error'
import type { ActiveSession, Attempt, QuizConfig, Section } from '../types'

interface HomePageProps {
  attempts: Attempt[]
  activeSession?: ActiveSession
  onStartQuiz: (config: QuizConfig) => Promise<void>
}

const DEFAULT_SECTION: Section = 'reading'

export function HomePage({
  attempts,
  activeSession,
  onStartQuiz,
}: HomePageProps) {
  const navigate = useNavigate()
  const insights = useMemo(() => analyzeAttempts(attempts), [attempts])
  const [fullCount, setFullCount] = useState(24)
  const [section, setSection] = useState<Section>(DEFAULT_SECTION)
  const [sectionCount, setSectionCount] = useState(12)
  const [focusedCount, setFocusedCount] = useState(10)
  const [busyMode, setBusyMode] = useState<string | null>(null)

  async function start(config: QuizConfig) {
    setBusyMode(config.mode)

    try {
      await onStartQuiz(config)
      navigate('/practice')
    } catch (error) {
      window.alert(getErrorMessage(error))
    } finally {
      setBusyMode(null)
    }
  }

  return (
    <>
      <section className="page-band page-band--intro">
        <div className="shell-inner intro-grid">
          <div className="intro-copy">
            <p className="eyebrow">For Dove</p>
            <h1>A calm runway into test day, with a fresh mix every time.</h1>
            <p className="lede">
              This site uses original practice content based on public skill
              domains. It is not affiliated with ETS, and it does not claim an
              official score or pass prediction.
            </p>

            <div className="metric-row">
              <div className="metric-card">
                <span className="metric-label">Attempts</span>
                <strong>{insights.attemptCount}</strong>
              </div>
              <div className="metric-card">
                <span className="metric-label">Best score</span>
                <strong>{Math.round(insights.bestScore)}%</strong>
              </div>
              <div className="metric-card">
                <span className="metric-label">Trend</span>
                <strong>{insights.trendDirection.replace('-', ' ')}</strong>
              </div>
            </div>

            <p className="storage-note">{STORAGE_NOTE}</p>
          </div>

          <figure className="study-photo">
            <img
              src={DOVE_HERO_IMAGE}
              alt="White dove in flight against a blue sky"
            />
          </figure>
        </div>
      </section>

      <section className="page-band">
        <div className="shell-inner action-grid">
          <article className="action-card">
            <h2>Full practice test</h2>
            <p>
              Balanced coverage across reading, writing, math, and classroom
              support.
            </p>
            <label className="field">
              <span>Questions</span>
              <select
                value={fullCount}
                onChange={(event) => setFullCount(Number(event.target.value))}
              >
                {FULL_TEST_COUNT_OPTIONS.map((count) => (
                  <option key={count} value={count}>
                    {count} questions
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              className="button button--primary"
              onClick={() =>
                void start({
                  mode: 'full-test',
                  count: fullCount,
                  title: 'Full Practice Test',
                })
              }
              disabled={busyMode !== null}
            >
              {busyMode === 'full-test'
                ? 'Starting...'
                : 'Start Full Practice Test'}
            </button>
          </article>

          <article className="action-card">
            <h2>Section quiz</h2>
            <p>Target one domain for a shorter focused review.</p>
            <label className="field">
              <span>Section</span>
              <select
                value={section}
                onChange={(event) => setSection(event.target.value as Section)}
              >
                {Object.entries(SECTION_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Questions</span>
              <select
                value={sectionCount}
                onChange={(event) =>
                  setSectionCount(Number(event.target.value))
                }
              >
                {SECTION_QUIZ_COUNT_OPTIONS.map((count) => (
                  <option key={count} value={count}>
                    {count} questions
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              className="button button--primary"
              onClick={() =>
                void start({
                  mode: 'section-quiz',
                  count: sectionCount,
                  section,
                  title: `${SECTION_LABELS[section]} Quiz`,
                })
              }
              disabled={busyMode !== null}
            >
              {busyMode === 'section-quiz'
                ? 'Starting...'
                : 'Start Section Quiz'}
            </button>
          </article>

          <article className="action-card">
            <h2>Weak-area quiz</h2>
            <p>
              Adaptive selection leans toward sections and topics you have
              missed before, so the next round meets you where you are.
            </p>
            <label className="field">
              <span>Questions</span>
              <select
                value={focusedCount}
                onChange={(event) =>
                  setFocusedCount(Number(event.target.value))
                }
              >
                {FOCUSED_QUIZ_COUNT_OPTIONS.map((count) => (
                  <option key={count} value={count}>
                    {count} questions
                  </option>
                ))}
              </select>
            </label>
            <div className="action-card__stack">
              <button
                type="button"
                className="button button--primary"
                onClick={() =>
                  void start({
                    mode: 'weak-area',
                    count: focusedCount,
                    title: 'Weak-Area Quiz',
                  })
                }
                disabled={busyMode !== null}
              >
                {busyMode === 'weak-area'
                  ? 'Starting...'
                  : 'Start Weak-Area Quiz'}
              </button>
              <button
                type="button"
                className="button button--secondary"
                onClick={() =>
                  void start({
                    mode: 'missed-only',
                    count: focusedCount,
                    title: 'Missed Questions Review',
                  })
                }
                disabled={busyMode !== null}
              >
                Start Missed-Only Review
              </button>
            </div>
          </article>
        </div>
      </section>

      <section className="page-band">
        <div className="shell-inner two-column-band">
          <div>
            <h2>Next study move</h2>
            <ul className="bullet-list">
              {insights.recommendedFocusAreas.slice(0, 4).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2>Keep the rhythm</h2>
            <ul className="bullet-list">
              {insights.studyTips.slice(0, 3).map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>

            {activeSession ? (
              <button
                type="button"
                className="button button--secondary"
                onClick={() => navigate('/practice')}
              >
                Resume Saved Session
              </button>
            ) : null}
          </div>
        </div>
      </section>
    </>
  )
}
