import { describe, expect, it } from 'vitest'
import type { Attempt } from '../../types'
import { analyzeAttempts } from './analyze'

const attempts: Attempt[] = [
  {
    id: 'a1',
    startedAt: '2026-04-10T10:00:00.000Z',
    completedAt: '2026-04-10T10:20:00.000Z',
    mode: 'full-test',
    title: 'Full Practice Test',
    count: 4,
    questionIds: ['1', '2', '3', '4'],
    answers: [
      {
        questionId: '1',
        section: 'reading',
        topic: 'main idea',
        selectedOption: 0,
        correctAnswer: 0,
        isCorrect: true,
      },
      {
        questionId: '2',
        section: 'writing',
        topic: 'grammar',
        selectedOption: 0,
        correctAnswer: 1,
        isCorrect: false,
      },
      {
        questionId: '3',
        section: 'math',
        topic: 'fractions',
        selectedOption: 0,
        correctAnswer: 1,
        isCorrect: false,
      },
      {
        questionId: '4',
        section: 'instructional-support',
        topic: 'behavior',
        selectedOption: 0,
        correctAnswer: 0,
        isCorrect: true,
      },
    ],
    sectionBreakdown: [
      { section: 'reading', correct: 1, total: 1, percent: 100 },
      { section: 'writing', correct: 0, total: 1, percent: 0 },
      { section: 'math', correct: 0, total: 1, percent: 0 },
      { section: 'instructional-support', correct: 1, total: 1, percent: 100 },
    ],
    totalCorrect: 2,
    percentCorrect: 50,
    durationSeconds: 1200,
    weakTopics: ['grammar', 'fractions'],
    missedQuestionIds: ['2', '3'],
    recommendedFocus: ['Writing refresh', 'fractions'],
  },
  {
    id: 'a2',
    startedAt: '2026-04-12T10:00:00.000Z',
    completedAt: '2026-04-12T10:20:00.000Z',
    mode: 'full-test',
    title: 'Full Practice Test',
    count: 4,
    questionIds: ['5', '6', '7', '8'],
    answers: [
      {
        questionId: '5',
        section: 'reading',
        topic: 'main idea',
        selectedOption: 0,
        correctAnswer: 0,
        isCorrect: true,
      },
      {
        questionId: '6',
        section: 'writing',
        topic: 'grammar',
        selectedOption: 1,
        correctAnswer: 1,
        isCorrect: true,
      },
      {
        questionId: '7',
        section: 'math',
        topic: 'fractions',
        selectedOption: 0,
        correctAnswer: 1,
        isCorrect: false,
      },
      {
        questionId: '8',
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
    durationSeconds: 1100,
    weakTopics: ['fractions'],
    missedQuestionIds: ['7'],
    recommendedFocus: ['Math refresh', 'fractions'],
  },
  {
    id: 'a3',
    startedAt: '2026-04-14T10:00:00.000Z',
    completedAt: '2026-04-14T10:20:00.000Z',
    mode: 'full-test',
    title: 'Full Practice Test',
    count: 4,
    questionIds: ['9', '10', '11', '12'],
    answers: [
      {
        questionId: '9',
        section: 'reading',
        topic: 'main idea',
        selectedOption: 0,
        correctAnswer: 0,
        isCorrect: true,
      },
      {
        questionId: '10',
        section: 'writing',
        topic: 'grammar',
        selectedOption: 1,
        correctAnswer: 1,
        isCorrect: true,
      },
      {
        questionId: '11',
        section: 'math',
        topic: 'fractions',
        selectedOption: 1,
        correctAnswer: 1,
        isCorrect: true,
      },
      {
        questionId: '12',
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
      { section: 'math', correct: 1, total: 1, percent: 100 },
      { section: 'instructional-support', correct: 1, total: 1, percent: 100 },
    ],
    totalCorrect: 4,
    percentCorrect: 100,
    durationSeconds: 1000,
    weakTopics: [],
    missedQuestionIds: [],
    recommendedFocus: ['Keep reading warm'],
  },
]

describe('analyzeAttempts', () => {
  it('summarizes strongest section, weak areas, and upward trend', () => {
    const insights = analyzeAttempts(attempts)

    expect(insights.attemptCount).toBe(3)
    expect(insights.strongestSection?.section).toBe('reading')
    expect(insights.weakestSection?.section).toBe('math')
    expect(insights.recurringTopics[0].topic).toBe('fractions')
    expect(insights.trendDirection).toBe('improving')
    expect(insights.recommendedFocusAreas[0]).toContain('Math')
  })
})
