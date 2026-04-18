import { describe, expect, it } from 'vitest'
import type { ActiveSession, Question } from '../../types'
import { scoreSession } from './scoring'

const questions = new Map<string, Question>([
  [
    'read-1',
    {
      id: 'read-1',
      section: 'reading',
      topic: 'main idea',
      difficulty: 'foundation',
      prompt: 'Reading prompt',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      explanation: 'Because it is the main idea.',
      tags: ['reading'],
    },
  ],
  [
    'math-1',
    {
      id: 'math-1',
      section: 'math',
      topic: 'fractions',
      difficulty: 'core',
      prompt: 'Math prompt',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      explanation: 'Fraction explanation.',
      tags: ['math'],
    },
  ],
])

describe('scoreSession', () => {
  it('builds total score, section scores, and weak topics', () => {
    const session: ActiveSession = {
      id: 'session-1',
      startedAt: '2026-04-18T17:00:00.000Z',
      lastResumedAt: '2026-04-18T17:09:00.000Z',
      paused: false,
      elapsedSeconds: 540,
      currentIndex: 1,
      config: {
        mode: 'full-test',
        count: 2,
        title: 'Full Practice Test',
      },
      questionIds: ['read-1', 'math-1'],
      answers: {
        'read-1': { questionId: 'read-1', selectedOption: 0, confidence: 3 },
        'math-1': { questionId: 'math-1', selectedOption: 1, confidence: 1 },
      },
    }

    const attempt = scoreSession(session, questions, '2026-04-18T17:10:00.000Z')

    expect(attempt.totalCorrect).toBe(1)
    expect(attempt.percentCorrect).toBe(50)
    expect(attempt.sectionBreakdown).toEqual([
      { section: 'reading', correct: 1, total: 1, percent: 100 },
      { section: 'math', correct: 0, total: 1, percent: 0 },
    ])
    expect(attempt.missedQuestionIds).toEqual(['math-1'])
    expect(attempt.weakTopics).toEqual(['fractions'])
    expect(attempt.recommendedFocus).toContain('Math refresh')
    expect(attempt.durationSeconds).toBe(600)
  })
})
