import { SECTION_LABELS } from '../../data/constants'
import { SECTIONS } from '../../types'
import type {
  Attempt,
  LearnerInsights,
  Section,
  SectionPerformance,
} from '../../types'

function getSectionPerformance(attempts: Attempt[]): SectionPerformance[] {
  const totals = SECTIONS.reduce<
    Record<Section, { correct: number; total: number }>
  >(
    (accumulator, section) => {
      accumulator[section] = { correct: 0, total: 0 }
      return accumulator
    },
    {} as Record<Section, { correct: number; total: number }>
  )

  for (const attempt of attempts) {
    for (const answer of attempt.answers) {
      totals[answer.section].total += 1

      if (answer.isCorrect) {
        totals[answer.section].correct += 1
      }
    }
  }

  return SECTIONS.map((section) => ({
    section,
    averagePercent:
      totals[section].total === 0
        ? 0
        : (totals[section].correct / totals[section].total) * 100,
    totalQuestions: totals[section].total,
  }))
}

function getTrendDirection(attempts: Attempt[]) {
  if (attempts.length < 3) {
    return { trendDirection: 'insufficient-data' as const, trendDelta: 0 }
  }

  const sorted = [...attempts].sort(
    (left, right) =>
      new Date(left.completedAt).getTime() -
      new Date(right.completedAt).getTime()
  )
  const recent = sorted.slice(-3)
  const earlier = sorted.slice(0, Math.max(1, sorted.length - 3))
  const recentAverage =
    recent.reduce((sum, attempt) => sum + attempt.percentCorrect, 0) /
    recent.length
  const earlierAverage =
    earlier.reduce((sum, attempt) => sum + attempt.percentCorrect, 0) /
    earlier.length
  const trendDelta = recentAverage - earlierAverage

  if (trendDelta >= 4) {
    return { trendDirection: 'improving' as const, trendDelta }
  }

  if (trendDelta <= -4) {
    return { trendDirection: 'declining' as const, trendDelta }
  }

  return { trendDirection: 'flat' as const, trendDelta }
}

function getRecurringTopics(attempts: Attempt[]) {
  return Array.from(
    attempts.reduce<Map<string, { misses: number; attemptsSeen: number }>>(
      (topicMap, attempt) => {
        const seenInAttempt = new Set<string>()

        for (const answer of attempt.answers) {
          const current = topicMap.get(answer.topic) ?? {
            misses: 0,
            attemptsSeen: 0,
          }

          if (!seenInAttempt.has(answer.topic)) {
            current.attemptsSeen += 1
            seenInAttempt.add(answer.topic)
          }

          if (!answer.isCorrect) {
            current.misses += 1
          }

          topicMap.set(answer.topic, current)
        }

        return topicMap
      },
      new Map()
    )
  )
    .map(([topic, values]) => ({ topic, ...values }))
    .sort(
      (left, right) =>
        right.misses - left.misses || left.topic.localeCompare(right.topic)
    )
}

export function analyzeAttempts(attempts: Attempt[]): LearnerInsights {
  if (attempts.length === 0) {
    return {
      attemptCount: 0,
      overallAverage: 0,
      recentAverage: 0,
      bestScore: 0,
      recurringTopics: [],
      trendDirection: 'insufficient-data',
      trendDelta: 0,
      recommendedFocusAreas: [
        'Start with one section quiz to collect a baseline.',
        'Use the explanations after each question to build study notes.',
      ],
      studyTips: [
        'Pick one short practice set and review every explanation.',
        'Aim for steady repetition rather than a single long cram session.',
      ],
    }
  }

  const sectionPerformance = getSectionPerformance(attempts)
  const strongestSection = [...sectionPerformance].sort(
    (left, right) => right.averagePercent - left.averagePercent
  )[0]
  const weakestSection = [...sectionPerformance].sort(
    (left, right) => left.averagePercent - right.averagePercent
  )[0]
  const recurringTopics = getRecurringTopics(attempts)
  const { trendDirection, trendDelta } = getTrendDirection(attempts)
  const overallAverage =
    attempts.reduce((sum, attempt) => sum + attempt.percentCorrect, 0) /
    attempts.length
  const recentAttempts = [...attempts].sort(
    (left, right) =>
      new Date(right.completedAt).getTime() -
      new Date(left.completedAt).getTime()
  )
  const recentWindow = recentAttempts.slice(
    0,
    Math.min(3, recentAttempts.length)
  )
  const recentAverage =
    recentWindow.reduce((sum, attempt) => sum + attempt.percentCorrect, 0) /
    recentWindow.length

  const recommendedFocusAreas = [
    `${SECTION_LABELS[weakestSection.section]}: rebuild fluency with short sets.`,
    ...recurringTopics.slice(0, 3).map((topic) => `Topic focus: ${topic}`),
  ]

  const studyTips = [
    `Keep ${SECTION_LABELS[strongestSection.section]} warm with a short review each week.`,
    trendDirection === 'improving'
      ? 'Your trend is moving up. Keep the practice rhythm steady and review misses right away.'
      : trendDirection === 'declining'
        ? 'Scores have dipped a bit. Shorter, more focused practice sets may help rebuild accuracy.'
        : 'Your trend is steady. A targeted weak-area quiz is a good next move.',
    'When you miss a question, say the reason out loud before reading the explanation.',
  ]

  return {
    attemptCount: attempts.length,
    overallAverage,
    recentAverage,
    bestScore: Math.max(...attempts.map((attempt) => attempt.percentCorrect)),
    strongestSection,
    weakestSection,
    recurringTopics: recurringTopics.slice(0, 6),
    trendDirection,
    trendDelta,
    recommendedFocusAreas,
    studyTips,
  }
}
