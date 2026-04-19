import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SECTION_LABELS } from '../data/constants'
import { questionsById } from '../data/questions'
import {
  countAnsweredQuestions,
  getElapsedSeconds,
  pauseSession,
  resumeSession,
  updateSessionAnswer,
  updateSessionConfidence,
  updateSessionIndex,
} from '../lib/quiz/session'
import { getErrorMessage } from '../lib/utils/error'
import { formatDuration } from '../lib/utils/format'
import { ProgressBar } from '../components/ProgressBar'
import { QuestionCard } from '../components/QuestionCard'
import type { ActiveSession, Attempt } from '../types'

interface PracticePageProps {
  activeSession?: ActiveSession
  onSessionChange: (session: ActiveSession) => Promise<void>
  onSubmitSession: (session: ActiveSession) => Promise<Attempt>
}

export function PracticePage({
  activeSession,
  onSessionChange,
  onSubmitSession,
}: PracticePageProps) {
  const navigate = useNavigate()
  const [clock, setClock] = useState(() =>
    activeSession
      ? new Date(
          activeSession.lastResumedAt ?? activeSession.startedAt
        ).getTime()
      : 0
  )

  const orderedQuestions = useMemo(
    () =>
      activeSession?.questionIds
        .map((questionId) => questionsById.get(questionId))
        .filter((question) => Boolean(question)) ?? [],
    [activeSession]
  )

  const currentQuestion = activeSession
    ? orderedQuestions[activeSession.currentIndex]
    : undefined

  useEffect(() => {
    if (!activeSession || activeSession.paused) {
      return undefined
    }

    const timer = window.setInterval(() => setClock(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [activeSession])

  useEffect(() => {
    if (!activeSession || activeSession.paused) {
      return undefined
    }

    const saveTimer = window.setInterval(() => {
      void onSessionChange({
        ...activeSession,
        elapsedSeconds: getElapsedSeconds(activeSession),
        lastResumedAt: new Date().toISOString(),
      }).catch(() => undefined)
    }, 15000)

    return () => window.clearInterval(saveTimer)
  }, [activeSession, onSessionChange])

  if (!activeSession || orderedQuestions.length === 0) {
    return (
      <section className="page-band">
        <div className="shell-inner empty-state">
          <h1>No active practice session</h1>
          <p>Start a new quiz from the home page to begin practicing.</p>
          <button
            type="button"
            className="button button--primary"
            onClick={() => navigate('/')}
          >
            Go Home
          </button>
        </div>
      </section>
    )
  }

  const session = activeSession

  const answeredCount = countAnsweredQuestions(session)
  const totalQuestions = session.questionIds.length
  const isLastQuestion = session.currentIndex === totalQuestions - 1
  const elapsedSeconds = session.paused
    ? session.elapsedSeconds
    : getElapsedSeconds(session, new Date(clock).toISOString())

  async function moveTo(index: number) {
    try {
      await onSessionChange(updateSessionIndex(session, index))
    } catch (error) {
      window.alert(getErrorMessage(error))
    }
  }

  async function handlePause() {
    try {
      await onSessionChange(pauseSession(session))
      navigate('/')
    } catch (error) {
      window.alert(getErrorMessage(error))
    }
  }

  async function handleResume() {
    try {
      await onSessionChange(resumeSession(session))
    } catch (error) {
      window.alert(getErrorMessage(error))
    }
  }

  async function handleSubmit() {
    if (answeredCount < totalQuestions) {
      const confirmSubmit = window.confirm(
        'Some questions are still unanswered. Submit anyway?'
      )

      if (!confirmSubmit) {
        return
      }
    }

    try {
      const attempt = await onSubmitSession(session)
      navigate(`/results/${attempt.id}`)
    } catch (error) {
      window.alert(getErrorMessage(error))
    }
  }

  function persistInlineChange(nextSession: ActiveSession) {
    void onSessionChange(nextSession).catch((error) =>
      window.alert(getErrorMessage(error))
    )
  }

  return (
    <section className="page-band">
      <div className="shell-inner practice-layout">
        <div className="practice-toolbar">
          <div>
            <p className="eyebrow">{session.config.title}</p>
            <h1>Question {session.currentIndex + 1}</h1>
            <p className="toolbar-copy">
              {currentQuestion ? SECTION_LABELS[currentQuestion.section] : ''} ·{' '}
              {formatDuration(elapsedSeconds)}
            </p>
          </div>

          <div className="practice-toolbar__actions">
            {session.paused ? (
              <button
                type="button"
                className="button button--secondary"
                onClick={() => void handleResume()}
              >
                Resume timer
              </button>
            ) : (
              <button
                type="button"
                className="button button--secondary"
                onClick={() => void handlePause()}
              >
                Pause and save
              </button>
            )}
            <button
              type="button"
              className="button button--primary"
              onClick={() => void handleSubmit()}
            >
              Submit attempt
            </button>
          </div>
        </div>

        <ProgressBar
          value={answeredCount}
          total={totalQuestions}
          label={`${answeredCount} of ${totalQuestions} answered`}
        />

        <div className="question-nav" aria-label="Question navigation">
          {session.questionIds.map((questionId, index) => {
            const answered =
              session.answers[questionId]?.selectedOption !== null

            return (
              <button
                key={questionId}
                type="button"
                className={
                  index === session.currentIndex
                    ? 'question-nav__button is-current'
                    : answered
                      ? 'question-nav__button is-answered'
                      : 'question-nav__button'
                }
                onClick={() => void moveTo(index)}
              >
                {index + 1}
              </button>
            )
          })}
        </div>

        {currentQuestion ? (
          <QuestionCard
            question={currentQuestion}
            selectedOption={
              session.answers[currentQuestion.id]?.selectedOption ?? null
            }
            confidence={session.answers[currentQuestion.id]?.confidence}
            onSelect={(selectedOption) =>
              persistInlineChange(
                updateSessionAnswer(session, currentQuestion.id, selectedOption)
              )
            }
            onConfidence={(confidence) =>
              persistInlineChange(
                updateSessionConfidence(session, currentQuestion.id, confidence)
              )
            }
          />
        ) : null}

        <div className="practice-footer">
          <button
            type="button"
            className="button button--secondary"
            onClick={() => void moveTo(Math.max(0, session.currentIndex - 1))}
            disabled={session.currentIndex === 0}
          >
            Previous
          </button>
          <button
            type="button"
            className="button button--primary"
            onClick={() =>
              isLastQuestion
                ? void handleSubmit()
                : void moveTo(
                    Math.min(totalQuestions - 1, session.currentIndex + 1)
                  )
            }
          >
            {isLastQuestion ? 'Submit attempt' : 'Next'}
          </button>
        </div>
      </div>
    </section>
  )
}
