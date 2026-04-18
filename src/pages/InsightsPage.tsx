import { useMemo } from 'react'
import { analyzeAttempts } from '../lib/insights/analyze'
import { formatPercent } from '../lib/utils/format'
import type { Attempt } from '../types'

interface InsightsPageProps {
  attempts: Attempt[]
}

export function InsightsPage({ attempts }: InsightsPageProps) {
  const insights = useMemo(() => analyzeAttempts(attempts), [attempts])

  return (
    <>
      <section className="page-band page-band--intro">
        <div className="shell-inner intro-grid">
          <div className="intro-copy">
            <p className="eyebrow">Study insights</p>
            <h1>
              See where your practice is paying off and what deserves the next
              round.
            </h1>
            <p className="lede">
              Trends here are study-readiness signals from your local practice
              history, not official score predictions.
            </p>

            <div className="metric-row">
              <div className="metric-card">
                <span className="metric-label">Overall average</span>
                <strong>{formatPercent(insights.overallAverage)}</strong>
              </div>
              <div className="metric-card">
                <span className="metric-label">Trend</span>
                <strong>{insights.trendDirection.replace('-', ' ')}</strong>
              </div>
              <div className="metric-card">
                <span className="metric-label">Recent average</span>
                <strong>{formatPercent(insights.recentAverage)}</strong>
              </div>
            </div>
          </div>

          <figure className="study-photo">
            <img
              src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1400&q=80"
              alt="Teacher leaning over a desk while supporting a student"
            />
          </figure>
        </div>
      </section>

      <section className="page-band">
        <div className="shell-inner insight-grid">
          <article className="action-card">
            <h2>Strongest section</h2>
            <p>
              {insights.strongestSection
                ? `${insights.strongestSection.section.replace('-', ' ')} at ${formatPercent(insights.strongestSection.averagePercent)}`
                : 'Build a baseline with your first attempt.'}
            </p>
          </article>
          <article className="action-card">
            <h2>Weakest section</h2>
            <p>
              {insights.weakestSection
                ? `${insights.weakestSection.section.replace('-', ' ')} at ${formatPercent(insights.weakestSection.averagePercent)}`
                : 'Build a baseline with your first attempt.'}
            </p>
          </article>
          <article className="action-card">
            <h2>Trend direction</h2>
            <p>
              {insights.trendDirection === 'insufficient-data'
                ? 'A few more attempts will make the trend clearer.'
                : `${insights.trendDirection} by ${Math.round(Math.abs(insights.trendDelta))} points.`}
            </p>
          </article>
        </div>
      </section>

      <section className="page-band">
        <div className="shell-inner two-column-band">
          <div>
            <h2>Recurring error patterns</h2>
            <ul className="bullet-list">
              {insights.recurringTopics.length > 0 ? (
                insights.recurringTopics.map((topic) => (
                  <li key={topic.topic}>
                    {topic.topic} · {topic.misses} misses across{' '}
                    {topic.attemptsSeen} attempts
                  </li>
                ))
              ) : (
                <li>No repeated trouble spots yet.</li>
              )}
            </ul>
          </div>
          <div>
            <h2>Recommended next study areas</h2>
            <ul className="bullet-list">
              {insights.recommendedFocusAreas.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="page-band">
        <div className="shell-inner">
          <h2>Plain-language coaching</h2>
          <ul className="bullet-list">
            {insights.studyTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
