import { Link, useNavigate, useParams } from 'react-router-dom'
import { SECTION_LABELS } from '../data/constants'
import { questionsById } from '../data/questions'
import { buildFriendlyReview } from '../lib/quiz/explanations'
import { getErrorMessage } from '../lib/utils/error'
import {
  formatDateTime,
  formatDuration,
  formatPercent,
} from '../lib/utils/format'
import type { Attempt, QuizConfig } from '../types'

interface ResultsPageProps {
  attempts: Attempt[]
  onStartQuiz: (config: QuizConfig) => Promise<void>
}

export function ResultsPage({ attempts, onStartQuiz }: ResultsPageProps) {
  const { attemptId } = useParams()
  const navigate = useNavigate()
  const attempt = attempts.find((item) => item.id === attemptId)

  if (!attempt) {
    return (
      <section className="page-band">
        <div className="shell-inner empty-state">
          <h1>Attempt not found</h1>
          <p>The result you asked for is not available in saved history.</p>
          <Link to="/history" className="button button--primary">
            View History
          </Link>
        </div>
      </section>
    )
  }

  async function startWeakArea() {
    try {
      await onStartQuiz({
        mode: 'weak-area',
        count: 10,
        title: 'Weak-Area Quiz',
      })
      navigate('/practice')
    } catch (error) {
      window.alert(getErrorMessage(error))
    }
  }

  return (
    <>
      <section className="page-band page-band--intro">
        <div className="shell-inner results-hero">
          <div>
            <p className="eyebrow">Attempt review</p>
            <h1>{attempt.title}</h1>
            <p className="lede">
              Completed {formatDateTime(attempt.completedAt)} ·{' '}
              {formatDuration(attempt.durationSeconds)}
            </p>
          </div>

          <div className="metric-row">
            <div className="metric-card">
              <span className="metric-label">Score</span>
              <strong>{formatPercent(attempt.percentCorrect)}</strong>
            </div>
            <div className="metric-card">
              <span className="metric-label">Correct</span>
              <strong>
                {attempt.totalCorrect}/{attempt.count}
              </strong>
            </div>
            <div className="metric-card">
              <span className="metric-label">Focus</span>
              <strong>{attempt.recommendedFocus[0] ?? 'Keep going'}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="page-band">
        <div className="shell-inner two-column-band">
          <div>
            <h2>Section scores</h2>
            <ul className="score-list">
              {attempt.sectionBreakdown.map((section) => (
                <li key={section.section} className="score-list__item">
                  <span>{SECTION_LABELS[section.section]}</span>
                  <strong>
                    {section.correct}/{section.total} (
                    {formatPercent(section.percent)})
                  </strong>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2>Recommended focus areas</h2>
            <ul className="bullet-list">
              {attempt.recommendedFocus.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <button
              type="button"
              className="button button--primary"
              onClick={() => void startWeakArea()}
            >
              Start a weak-area quiz
            </button>
          </div>
        </div>
      </section>

      <section className="page-band">
        <div className="shell-inner">
          <h2>Question review</h2>
          <div className="review-list">
            {attempt.answers.map((answer, index) => {
              const question = questionsById.get(answer.questionId)

              if (!question) {
                return null
              }

              const review = buildFriendlyReview(question, answer)

              return (
                <details key={answer.questionId} className="review-card">
                  <summary>
                    <span>Question {index + 1}</span>
                    <strong
                      className={
                        answer.isCorrect ? 'result-good' : 'result-miss'
                      }
                    >
                      {answer.isCorrect ? 'Correct' : 'Review'}
                    </strong>
                  </summary>
                  {question.scenario ? <p>{question.scenario}</p> : null}
                  <p>{question.prompt}</p>
                  <ul className="review-options">
                    {question.options.map((option, optionIndex) => {
                      const isCorrect = optionIndex === question.correctAnswer
                      const isChosen = optionIndex === answer.selectedOption

                      return (
                        <li
                          key={option}
                          className={
                            isCorrect
                              ? 'review-option is-correct'
                              : isChosen
                                ? 'review-option is-selected'
                                : 'review-option'
                          }
                        >
                          <span>{String.fromCharCode(65 + optionIndex)}.</span>{' '}
                          {option}
                        </li>
                      )
                    })}
                  </ul>
                  <div className="review-coaching">
                    <div className="review-answer-grid">
                      <div className="review-answer-row">
                        <span className="review-answer-row__label">
                          Correct answer
                        </span>
                        <strong>
                          {review.correctChoice.label}.{' '}
                          {review.correctChoice.text}
                        </strong>
                      </div>
                      <div className="review-answer-row">
                        <span className="review-answer-row__label">
                          Your answer
                        </span>
                        <strong>
                          {review.selectedChoice
                            ? `${review.selectedChoice.label}. ${review.selectedChoice.text}`
                            : 'Not answered'}
                        </strong>
                      </div>
                    </div>

                    <p className="review-coaching__status">
                      {review.statusMessage}
                    </p>
                    <p className="review-explanation">
                      <strong>Why this is right:</strong> {question.explanation}
                    </p>
                    <p className="review-simple">{review.simpleReason}</p>

                    <div className="review-coaching__steps">
                      <p className="review-coaching__title">
                        {review.coachingTitle}
                      </p>
                      <ol className="review-steps">
                        {review.nextTimeSteps.map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </details>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
