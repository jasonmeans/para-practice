import { SECTION_LABELS } from '../../data/constants'
import type {
  ActiveSession,
  Attempt,
  AttemptAnswer,
  Question,
  Section,
  SectionScore,
} from '../../types'
import { getElapsedSeconds } from './session'
import { createId } from '../utils/id'

function buildSectionBreakdown(answers: AttemptAnswer[]): SectionScore[] {
  const sectionMap = new Map<Section, { correct: number; total: number }>()

  for (const answer of answers) {
    const current = sectionMap.get(answer.section) ?? { correct: 0, total: 0 }
    current.total += 1

    if (answer.isCorrect) {
      current.correct += 1
    }

    sectionMap.set(answer.section, current)
  }

  return Array.from(sectionMap.entries()).map(([section, totals]) => ({
    section,
    correct: totals.correct,
    total: totals.total,
    percent: totals.total === 0 ? 0 : (totals.correct / totals.total) * 100,
  }))
}

function buildRecommendedFocus(
  sectionBreakdown: SectionScore[],
  weakTopics: string[]
) {
  const focus = new Set<string>()

  const weakestSections = [...sectionBreakdown]
    .sort((left, right) => left.percent - right.percent)
    .slice(0, 2)

  for (const section of weakestSections) {
    focus.add(`${SECTION_LABELS[section.section]} refresh`)
  }

  for (const topic of weakTopics.slice(0, 3)) {
    focus.add(topic)
  }

  return Array.from(focus)
}

export function scoreSession(
  session: ActiveSession,
  questions: Map<string, Question>,
  now = new Date().toISOString()
): Attempt {
  const answerRows: AttemptAnswer[] = session.questionIds.map((questionId) => {
    const question = questions.get(questionId)

    if (!question) {
      throw new Error(`Missing question: ${questionId}`)
    }

    const selected = session.answers[questionId]?.selectedOption ?? null

    return {
      questionId,
      section: question.section,
      topic: question.topic,
      selectedOption: selected,
      correctAnswer: question.correctAnswer,
      isCorrect: selected === question.correctAnswer,
      confidence: session.answers[questionId]?.confidence,
    }
  })

  const totalCorrect = answerRows.filter((answer) => answer.isCorrect).length
  const sectionBreakdown = buildSectionBreakdown(answerRows)
  const weakTopics = Array.from(
    answerRows
      .filter((answer) => !answer.isCorrect)
      .reduce<Map<string, number>>((topicCounts, answer) => {
        topicCounts.set(answer.topic, (topicCounts.get(answer.topic) ?? 0) + 1)
        return topicCounts
      }, new Map())
      .entries()
  )
    .sort(
      (left, right) => right[1] - left[1] || left[0].localeCompare(right[0])
    )
    .map(([topic]) => topic)

  return {
    id: createId(),
    startedAt: session.startedAt,
    completedAt: now,
    mode: session.config.mode,
    title: session.config.title,
    count: session.questionIds.length,
    section: session.config.section,
    questionIds: session.questionIds,
    answers: answerRows,
    sectionBreakdown,
    totalCorrect,
    percentCorrect:
      session.questionIds.length === 0
        ? 0
        : (totalCorrect / session.questionIds.length) * 100,
    durationSeconds: getElapsedSeconds(session, now),
    weakTopics,
    missedQuestionIds: answerRows
      .filter((answer) => !answer.isCorrect)
      .map((answer) => answer.questionId),
    recommendedFocus: buildRecommendedFocus(sectionBreakdown, weakTopics),
  }
}
