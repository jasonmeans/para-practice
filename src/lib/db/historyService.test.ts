import { afterEach, describe, expect, it } from 'vitest'
import type { ActiveSession, Attempt } from '../../types'
import { createAppDb } from './database'
import {
  clearAllHistory,
  exportHistory,
  getActiveSession,
  getAttempts,
  importHistory,
  saveActiveSession,
  saveAttempt,
} from './historyService'

const databases: ReturnType<typeof createAppDb>[] = []

afterEach(async () => {
  await Promise.all(
    databases.splice(0).map(async (database) => {
      await database.delete()
    })
  )
})

describe('historyService', () => {
  it('saves, exports, clears, and reimports local history', async () => {
    const database = createAppDb(`test-db-${crypto.randomUUID()}`)
    databases.push(database)

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

    await saveAttempt(attempt, database)
    await saveActiveSession(session, database)

    const exported = await exportHistory(database)
    expect(exported.attempts).toHaveLength(1)
    expect(exported.activeSession?.id).toBe('session-1')

    await clearAllHistory(database)
    expect(await getAttempts(database)).toHaveLength(0)
    expect(await getActiveSession(database)).toBeUndefined()

    await importHistory(exported, database)
    expect(await getAttempts(database)).toHaveLength(1)
    expect((await getActiveSession(database))?.id).toBe('session-1')
  })
})
