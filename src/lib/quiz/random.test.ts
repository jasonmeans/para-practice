import { describe, expect, it } from 'vitest'
import type { Attempt, Question } from '../../types'
import { createSeededRandom } from './random'
import { buildWeaknessProfile, selectQuizQuestions } from './engine'

const pool: Question[] = [
  {
    id: 'r1',
    section: 'reading',
    topic: 'main idea',
    difficulty: 'foundation',
    prompt: 'r1',
    options: ['A', 'B', 'C', 'D'],
    correctAnswer: 0,
    explanation: 'x',
    tags: [],
  },
  {
    id: 'r2',
    section: 'reading',
    topic: 'evidence',
    difficulty: 'core',
    prompt: 'r2',
    options: ['A', 'B', 'C', 'D'],
    correctAnswer: 0,
    explanation: 'x',
    tags: [],
  },
  {
    id: 'w1',
    section: 'writing',
    topic: 'grammar',
    difficulty: 'foundation',
    prompt: 'w1',
    options: ['A', 'B', 'C', 'D'],
    correctAnswer: 0,
    explanation: 'x',
    tags: [],
  },
  {
    id: 'w2',
    section: 'writing',
    topic: 'grammar',
    difficulty: 'core',
    prompt: 'w2',
    options: ['A', 'B', 'C', 'D'],
    correctAnswer: 1,
    explanation: 'x',
    tags: [],
  },
  {
    id: 'm1',
    section: 'math',
    topic: 'fractions',
    difficulty: 'core',
    prompt: 'm1',
    options: ['A', 'B', 'C', 'D'],
    correctAnswer: 2,
    explanation: 'x',
    tags: [],
  },
  {
    id: 'm2',
    section: 'math',
    topic: 'fractions',
    difficulty: 'stretch',
    prompt: 'm2',
    options: ['A', 'B', 'C', 'D'],
    correctAnswer: 1,
    explanation: 'x',
    tags: ['fractions', 'fraction-operation'],
  },
  {
    id: 'm3',
    section: 'math',
    topic: 'percentages',
    difficulty: 'core',
    prompt: 'm3',
    options: ['A', 'B', 'C', 'D'],
    correctAnswer: 1,
    explanation: 'x',
    tags: ['percentages', 'percent'],
  },
  {
    id: 'm4',
    section: 'math',
    topic: 'geometry',
    difficulty: 'core',
    prompt: 'm4',
    options: ['A', 'B', 'C', 'D'],
    correctAnswer: 1,
    explanation: 'x',
    tags: ['geometry', 'area'],
  },
  {
    id: 'm5',
    section: 'math',
    topic: 'order of operations',
    difficulty: 'core',
    prompt: 'm5',
    options: ['A', 'B', 'C', 'D'],
    correctAnswer: 1,
    explanation: 'x',
    tags: ['order-of-operations', 'pemdas'],
  },
  {
    id: 'i1',
    section: 'instructional-support',
    topic: 'behavior',
    difficulty: 'foundation',
    prompt: 'i1',
    options: ['A', 'B', 'C', 'D'],
    correctAnswer: 0,
    explanation: 'x',
    tags: [],
  },
  {
    id: 'i2',
    section: 'instructional-support',
    topic: 'behavior',
    difficulty: 'core',
    prompt: 'i2',
    options: ['A', 'B', 'C', 'D'],
    correctAnswer: 0,
    explanation: 'x',
    tags: [],
  },
]

const priorAttempts: Attempt[] = [
  {
    id: 'attempt-1',
    startedAt: '2026-04-16T12:00:00.000Z',
    completedAt: '2026-04-16T12:20:00.000Z',
    mode: 'full-test',
    title: 'Full Practice Test',
    count: 4,
    questionIds: ['r1', 'w1', 'm1', 'i1'],
    answers: [
      {
        questionId: 'r1',
        section: 'reading',
        topic: 'main idea',
        selectedOption: 0,
        correctAnswer: 0,
        isCorrect: true,
      },
      {
        questionId: 'w1',
        section: 'writing',
        topic: 'grammar',
        selectedOption: 0,
        correctAnswer: 0,
        isCorrect: true,
      },
      {
        questionId: 'm1',
        section: 'math',
        topic: 'fractions',
        selectedOption: 0,
        correctAnswer: 2,
        isCorrect: false,
      },
      {
        questionId: 'i1',
        section: 'instructional-support',
        topic: 'behavior',
        selectedOption: 0,
        correctAnswer: 0,
        isCorrect: true,
      },
    ],
    sectionBreakdown: [
      { section: 'reading', correct: 1, total: 1, percent: 100 },
      { section: 'writing', correct: 1, total: 1, percent: 100 },
      { section: 'math', correct: 0, total: 1, percent: 0 },
      { section: 'instructional-support', correct: 1, total: 1, percent: 100 },
    ],
    totalCorrect: 3,
    percentCorrect: 75,
    durationSeconds: 1200,
    weakTopics: ['fractions'],
    missedQuestionIds: ['m1'],
    recommendedFocus: ['Math refresh', 'fractions'],
  },
]

describe('quiz engine', () => {
  it('tracks recent questions and misses in the weakness profile', () => {
    const profile = buildWeaknessProfile(priorAttempts)

    expect(profile.recentQuestionIds.has('m1')).toBe(true)
    expect(profile.missedQuestionIds.has('m1')).toBe(true)
    expect(profile.sectionAccuracy.math).toBe(0)
    expect(profile.sectionAccuracy.reading).toBe(100)
  })

  it('avoids recent questions when fresh section questions exist', () => {
    const selected = selectQuizQuestions(
      {
        mode: 'section-quiz',
        count: 1,
        section: 'reading',
        title: 'Reading Quiz',
      },
      pool,
      priorAttempts,
      createSeededRandom(9)
    )

    expect(selected).toHaveLength(1)
    expect(selected[0].id).toBe('r2')
  })

  it('leans weak-area quizzes toward historically missed content', () => {
    const selected = selectQuizQuestions(
      {
        mode: 'weak-area',
        count: 2,
        title: 'Weak-Area Quiz',
      },
      pool,
      priorAttempts,
      createSeededRandom(4)
    )

    expect(selected.some((question) => question.section === 'math')).toBe(true)
    expect(selected.some((question) => question.topic === 'fractions')).toBe(
      true
    )
  })

  it('gives full tests more math than instructional-support and covers key math areas', () => {
    const selected = selectQuizQuestions(
      {
        mode: 'full-test',
        count: 8,
        title: 'Full Practice Test',
      },
      pool,
      priorAttempts,
      createSeededRandom(3)
    )

    const mathQuestions = selected.filter((question) => question.section === 'math')
    const supportQuestions = selected.filter(
      (question) => question.section === 'instructional-support'
    )

    expect(mathQuestions.length).toBeGreaterThan(supportQuestions.length)
    expect(mathQuestions.some((question) => question.topic === 'fractions')).toBe(
      true
    )
    expect(
      mathQuestions.some(
        (question) =>
          question.topic === 'percentages' || question.topic === 'geometry'
      )
    ).toBe(true)
  })
})
