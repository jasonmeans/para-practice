import type { ActiveSession, Question, SessionAnswer } from '../../types'

export function createSessionAnswers(questionIds: string[]) {
  return questionIds.reduce<Record<string, SessionAnswer>>(
    (answers, questionId) => {
      answers[questionId] = { questionId, selectedOption: null }
      return answers
    },
    {}
  )
}

export function getElapsedSeconds(
  session: ActiveSession,
  now = new Date().toISOString()
) {
  if (session.paused || !session.lastResumedAt) {
    return session.elapsedSeconds
  }

  const deltaSeconds = Math.max(
    0,
    Math.floor(
      (new Date(now).getTime() - new Date(session.lastResumedAt).getTime()) /
        1000
    )
  )

  return session.elapsedSeconds + deltaSeconds
}

export function pauseSession(
  session: ActiveSession,
  now = new Date().toISOString()
) {
  return {
    ...session,
    paused: true,
    elapsedSeconds: getElapsedSeconds(session, now),
    lastResumedAt: undefined,
  }
}

export function resumeSession(
  session: ActiveSession,
  now = new Date().toISOString()
) {
  return {
    ...session,
    paused: false,
    lastResumedAt: now,
  }
}

export function updateSessionAnswer(
  session: ActiveSession,
  questionId: string,
  selectedOption: number
) {
  return {
    ...session,
    answers: {
      ...session.answers,
      [questionId]: {
        ...session.answers[questionId],
        questionId,
        selectedOption,
      },
    },
  }
}

export function updateSessionConfidence(
  session: ActiveSession,
  questionId: string,
  confidence: 1 | 2 | 3
) {
  return {
    ...session,
    answers: {
      ...session.answers,
      [questionId]: {
        ...session.answers[questionId],
        questionId,
        confidence,
      },
    },
  }
}

export function updateSessionIndex(
  session: ActiveSession,
  currentIndex: number
) {
  return {
    ...session,
    currentIndex,
  }
}

export function countAnsweredQuestions(session: ActiveSession) {
  return Object.values(session.answers).filter(
    (answer) => answer.selectedOption !== null
  ).length
}

export function getQuestionOrder(
  session: ActiveSession,
  questions: Map<string, Question>
) {
  return session.questionIds
    .map((questionId) => questions.get(questionId))
    .filter((question): question is Question => Boolean(question))
}
