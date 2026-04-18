import { describe, expect, it } from 'vitest'
import type { ActiveSession, Attempt, HistoryExport } from '../../types'
import {
  fromActiveSessionRecord,
  fromAttemptRecord,
  isHistoryExport,
  toActiveSessionRecord,
  toAttemptRecord,
} from './historyService'

const attempt: Attempt = {
  id: 'attempt-1',
  startedAt: '2026-04-18T12:00:00.000Z',
  completedAt: '2026-04-18T12:20:00.000Z',
  mode: 'full-test',
  title: 'Full Practice Test',
  count: 2,
  questionIds: ['q1', 'q2'],
  answers: [
    {
      questionId: 'q1',
      section: 'reading',
      topic: 'main idea',
      selectedOption: 0,
      correctAnswer: 0,
      isCorrect: true,
    },
  ],
  sectionBreakdown: [
    { section: 'reading', correct: 1, total: 1, percent: 100 },
  ],
  totalCorrect: 1,
  percentCorrect: 50,
  durationSeconds: 600,
  weakTopics: ['fractions'],
  missedQuestionIds: ['q2'],
  recommendedFocus: ['Math refresh'],
}

const session: ActiveSession = {
  id: 'session-1',
  startedAt: '2026-04-18T12:30:00.000Z',
  lastResumedAt: '2026-04-18T12:30:00.000Z',
  paused: false,
  elapsedSeconds: 0,
  currentIndex: 0,
  config: {
    mode: 'section-quiz',
    count: 1,
    section: 'math',
    title: 'Math Quiz',
  },
  questionIds: ['math-1'],
  answers: {
    'math-1': { questionId: 'math-1', selectedOption: null },
  },
}

describe('backend history helpers', () => {
  it('converts attempts to backend records and back', () => {
    const record = toAttemptRecord('user-1', attempt)
    expect(record.user_id).toBe('user-1')
    expect(record.completed_at).toBe(attempt.completedAt)
    expect(fromAttemptRecord(record)).toEqual(attempt)
  })

  it('converts active sessions to backend records and back', () => {
    const record = toActiveSessionRecord('user-1', session)
    expect(record.user_id).toBe('user-1')
    expect(fromActiveSessionRecord(record)).toEqual(session)
  })

  it('validates history export payloads', () => {
    const payload: HistoryExport = {
      version: 1,
      exportedAt: '2026-04-18T12:40:00.000Z',
      attempts: [attempt],
      activeSession: session,
    }

    expect(isHistoryExport(payload)).toBe(true)
    expect(
      isHistoryExport({
        version: 1,
        exportedAt: 'now',
        attempts: [{ nope: true }],
      })
    ).toBe(false)
  })
})
