import { SECTIONS } from '../../types'
import type {
  ActiveSession,
  Attempt,
  Question,
  QuizConfig,
  Section,
} from '../../types'
import { createSessionAnswers } from './session'
import {
  shuffle,
  type RandomFn,
  weightedSampleWithoutReplacement,
} from './random'
import { createId } from '../utils/id'

interface WeaknessProfile {
  recentQuestionIds: Set<string>
  missedQuestionIds: Set<string>
  sectionAccuracy: Record<Section, number>
  topicMisses: Map<string, number>
}

const FULL_TEST_SECTION_SHARES: Record<Section, number> = {
  reading: 0.25,
  writing: 0.25,
  math: 1 / 3,
  'instructional-support': 1 / 6,
}

const FULL_TEST_MATH_FOCUS_GROUPS = [
  new Set(['fractions', 'fraction-operation', 'common-denominator']),
  new Set(['percentages', 'percent', 'equivalent-form']),
  new Set(['geometry', 'area', 'perimeter']),
  new Set(['order-of-operations', 'pemdas']),
]

function sortAttemptsByDate(attempts: Attempt[]) {
  return [...attempts].sort(
    (left, right) =>
      new Date(right.completedAt).getTime() -
      new Date(left.completedAt).getTime()
  )
}

export function buildWeaknessProfile(attempts: Attempt[]): WeaknessProfile {
  const sortedAttempts = sortAttemptsByDate(attempts)
  const recentAttempts = sortedAttempts.slice(0, 3)

  const sectionTotals = SECTIONS.reduce<
    Record<Section, { correct: number; total: number }>
  >(
    (accumulator, section) => {
      accumulator[section] = { correct: 0, total: 0 }
      return accumulator
    },
    {} as Record<Section, { correct: number; total: number }>
  )

  const topicMisses = new Map<string, number>()
  const missedQuestionIds = new Set<string>()

  for (const attempt of sortedAttempts) {
    for (const answer of attempt.answers) {
      sectionTotals[answer.section].total += 1

      if (answer.isCorrect) {
        sectionTotals[answer.section].correct += 1
      } else {
        topicMisses.set(answer.topic, (topicMisses.get(answer.topic) ?? 0) + 1)
        missedQuestionIds.add(answer.questionId)
      }
    }
  }

  const sectionAccuracy = SECTIONS.reduce<Record<Section, number>>(
    (accumulator, section) => {
      const totals = sectionTotals[section]
      accumulator[section] =
        totals.total === 0 ? 70 : (totals.correct / totals.total) * 100
      return accumulator
    },
    {} as Record<Section, number>
  )

  return {
    recentQuestionIds: new Set(
      recentAttempts.flatMap((attempt) => attempt.questionIds)
    ),
    missedQuestionIds,
    sectionAccuracy,
    topicMisses,
  }
}

function getQuestionWeight(question: Question, profile: WeaknessProfile) {
  const sectionNeed =
    Math.max(0, 100 - profile.sectionAccuracy[question.section]) / 25
  const topicNeed = (profile.topicMisses.get(question.topic) ?? 0) * 0.35
  const missedBoost = profile.missedQuestionIds.has(question.id) ? 0.8 : 0
  const focusBoost = isMathFocusQuestion(question) ? 0.45 : 0
  const difficultyBoost =
    question.difficulty === 'core'
      ? question.section === 'math'
        ? 0.2
        : 0.1
      : question.difficulty === 'stretch'
        ? question.section === 'math'
          ? 0.35
          : 0.2
        : 0

  return 1 + sectionNeed + topicNeed + missedBoost + focusBoost + difficultyBoost
}

function hasAnyTag(question: Question, tags: Set<string>) {
  return question.tags.some((tag) => tags.has(tag))
}

function isMathFocusQuestion(question: Question) {
  return (
    question.section === 'math' &&
    FULL_TEST_MATH_FOCUS_GROUPS.some((tags) => hasAnyTag(question, tags))
  )
}

function selectFromPool(
  pool: Question[],
  count: number,
  profile: WeaknessProfile,
  random: RandomFn
) {
  const fresh = pool.filter(
    (question) => !profile.recentQuestionIds.has(question.id)
  )
  const recent = pool.filter((question) =>
    profile.recentQuestionIds.has(question.id)
  )

  const selectedFresh = weightedSampleWithoutReplacement(
    fresh,
    count,
    (question) => getQuestionWeight(question, profile),
    random
  )

  if (selectedFresh.length >= count) {
    return shuffle(selectedFresh, random)
  }

  const selectedRecent = weightedSampleWithoutReplacement(
    recent.filter(
      (question) =>
        !selectedFresh.some((selected) => selected.id === question.id)
    ),
    count - selectedFresh.length,
    (question) => getQuestionWeight(question, profile),
    random
  )

  return shuffle([...selectedFresh, ...selectedRecent], random)
}

function buildFullTestSelection(
  config: QuizConfig,
  questions: Question[],
  profile: WeaknessProfile,
  random: RandomFn
) {
  const quotas = SECTIONS.reduce<Record<Section, number>>(
    (accumulator, section) => {
      accumulator[section] = Math.floor(config.count * FULL_TEST_SECTION_SHARES[section])
      return accumulator
    },
    {} as Record<Section, number>
  )

  const allocated = Object.values(quotas).reduce(
    (sum, current) => sum + current,
    0
  )
  const remainder = config.count - allocated
  const prioritySections = [...SECTIONS].sort((left, right) => {
    const shareDelta =
      config.count * FULL_TEST_SECTION_SHARES[right] -
      quotas[right] -
      (config.count * FULL_TEST_SECTION_SHARES[left] - quotas[left])

    if (shareDelta !== 0) {
      return shareDelta
    }

    return profile.sectionAccuracy[left] - profile.sectionAccuracy[right]
  })

  for (let index = 0; index < remainder; index += 1) {
    quotas[prioritySections[index]] += 1
  }

  const selected = SECTIONS.flatMap((section) =>
    section === 'math'
      ? selectMathFullTestQuestions(
          questions.filter((question) => question.section === section),
          quotas[section],
          profile,
          random
        )
      : selectFromPool(
          questions.filter((question) => question.section === section),
          quotas[section],
          profile,
          random
        )
  )

  if (selected.length >= config.count) {
    return shuffle(selected, random).slice(0, config.count)
  }

  const remaining = questions.filter(
    (question) => !selected.some((picked) => picked.id === question.id)
  )

  return shuffle(
    [
      ...selected,
      ...selectFromPool(
        remaining,
        config.count - selected.length,
        profile,
        random
      ),
    ],
    random
  )
}

function selectMathFullTestQuestions(
  pool: Question[],
  count: number,
  profile: WeaknessProfile,
  random: RandomFn
) {
  if (count <= 0) {
    return []
  }

  const selected: Question[] = []

  for (const focusTags of FULL_TEST_MATH_FOCUS_GROUPS) {
    if (selected.length >= count) {
      break
    }

    const focusPool = pool.filter(
      (question) =>
        hasAnyTag(question, focusTags) &&
        !selected.some((candidate) => candidate.id === question.id)
    )
    const freshFocusPool = focusPool.filter(
      (question) => !profile.recentQuestionIds.has(question.id)
    )
    const [picked] = weightedSampleWithoutReplacement(
      freshFocusPool.length > 0 ? freshFocusPool : focusPool,
      1,
      (question) => getQuestionWeight(question, profile),
      random
    )

    if (picked) {
      selected.push(picked)
    }
  }

  if (selected.length >= count) {
    return shuffle(selected.slice(0, count), random)
  }

  const fillPool = pool.filter(
    (question) => !selected.some((candidate) => candidate.id === question.id)
  )

  return shuffle(
    [
      ...selected,
      ...selectFromPool(fillPool, count - selected.length, profile, random),
    ],
    random
  )
}

function buildWeakAreaSelection(
  config: QuizConfig,
  questions: Question[],
  profile: WeaknessProfile,
  random: RandomFn
) {
  const weakestSections = [...SECTIONS]
    .sort(
      (left, right) =>
        profile.sectionAccuracy[left] - profile.sectionAccuracy[right]
    )
    .slice(0, 2)

  const recurringTopics = Array.from(profile.topicMisses.entries())
    .sort(
      (left, right) => right[1] - left[1] || left[0].localeCompare(right[0])
    )
    .slice(0, 4)
    .map(([topic]) => topic)

  const candidatePool = questions.filter(
    (question) =>
      weakestSections.includes(question.section) ||
      recurringTopics.includes(question.topic) ||
      profile.missedQuestionIds.has(question.id)
  )

  const sourcePool =
    candidatePool.length >= config.count ? candidatePool : questions
  return selectFromPool(sourcePool, config.count, profile, random)
}

function buildMissedOnlySelection(
  config: QuizConfig,
  questions: Question[],
  profile: WeaknessProfile,
  random: RandomFn
) {
  const missedOnlyPool = questions.filter((question) =>
    profile.missedQuestionIds.has(question.id)
  )

  if (missedOnlyPool.length === 0) {
    return buildWeakAreaSelection(config, questions, profile, random)
  }

  if (missedOnlyPool.length >= config.count) {
    return selectFromPool(missedOnlyPool, config.count, profile, random)
  }

  const fillPool = questions.filter(
    (question) => !missedOnlyPool.some((missed) => missed.id === question.id)
  )

  return shuffle(
    [
      ...selectFromPool(missedOnlyPool, missedOnlyPool.length, profile, random),
      ...selectFromPool(
        fillPool,
        config.count - missedOnlyPool.length,
        profile,
        random
      ),
    ],
    random
  )
}

export function selectQuizQuestions(
  config: QuizConfig,
  questions: Question[],
  attempts: Attempt[],
  random: RandomFn = Math.random
) {
  const profile = buildWeaknessProfile(attempts)

  switch (config.mode) {
    case 'section-quiz':
      return selectFromPool(
        questions.filter((question) => question.section === config.section),
        config.count,
        profile,
        random
      )
    case 'weak-area':
      return buildWeakAreaSelection(config, questions, profile, random)
    case 'missed-only':
      return buildMissedOnlySelection(config, questions, profile, random)
    case 'full-test':
    default:
      return buildFullTestSelection(config, questions, profile, random)
  }
}

export function createQuizSession(
  config: QuizConfig,
  questions: Question[],
  attempts: Attempt[],
  now = new Date().toISOString(),
  random: RandomFn = Math.random
): ActiveSession {
  const selectedQuestions = selectQuizQuestions(
    config,
    questions,
    attempts,
    random
  )
  const questionIds = selectedQuestions.map((question) => question.id)

  return {
    id: createId(),
    startedAt: now,
    lastResumedAt: now,
    paused: false,
    elapsedSeconds: 0,
    currentIndex: 0,
    config,
    questionIds,
    answers: createSessionAnswers(questionIds),
  }
}
