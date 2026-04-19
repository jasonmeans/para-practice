import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import type { ActiveSession, Attempt } from '../types'
import { PracticePage } from './PracticePage'

const activeSession: ActiveSession = {
  id: 'session-1',
  startedAt: '2026-04-18T12:00:00.000Z',
  lastResumedAt: '2026-04-18T12:00:00.000Z',
  paused: false,
  elapsedSeconds: 90,
  currentIndex: 1,
  config: {
    mode: 'section-quiz',
    count: 2,
    section: 'math',
    title: 'Math Quiz',
  },
  questionIds: ['math-001', 'math-003'],
  answers: {
    'math-001': {
      questionId: 'math-001',
      selectedOption: 1,
      confidence: 2,
    },
    'math-003': {
      questionId: 'math-003',
      selectedOption: 1,
      confidence: 2,
    },
  },
}

const completedAttempt: Attempt = {
  id: 'attempt-1',
  startedAt: activeSession.startedAt,
  completedAt: '2026-04-18T12:10:00.000Z',
  mode: 'section-quiz',
  title: 'Math Quiz',
  count: 2,
  section: 'math',
  questionIds: ['math-001', 'math-003'],
  answers: [
    {
      questionId: 'math-001',
      section: 'math',
      topic: 'fractions',
      selectedOption: 1,
      correctAnswer: 1,
      isCorrect: true,
      confidence: 2,
    },
    {
      questionId: 'math-003',
      section: 'math',
      topic: 'percentages',
      selectedOption: 1,
      correctAnswer: 1,
      isCorrect: true,
      confidence: 2,
    },
  ],
  sectionBreakdown: [{ section: 'math', correct: 2, total: 2, percent: 100 }],
  totalCorrect: 2,
  percentCorrect: 100,
  durationSeconds: 600,
  weakTopics: [],
  missedQuestionIds: [],
  recommendedFocus: [],
}

describe('PracticePage', () => {
  it('replaces the last next button with submit and submits the session', async () => {
    const onSessionChange = vi.fn().mockResolvedValue(undefined)
    const onSubmitSession = vi.fn().mockResolvedValue(completedAttempt)
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <PracticePage
          activeSession={activeSession}
          onSessionChange={onSessionChange}
          onSubmitSession={onSubmitSession}
        />
      </MemoryRouter>
    )

    const footer = document.querySelector('.practice-footer')

    expect(footer).not.toBeNull()
    expect(
      within(footer as HTMLElement).getByRole('button', { name: 'Submit attempt' })
    ).toBeInTheDocument()
    expect(
      within(footer as HTMLElement).queryByRole('button', { name: 'Next' })
    ).not.toBeInTheDocument()

    await user.click(
      within(footer as HTMLElement).getByRole('button', { name: 'Submit attempt' })
    )

    expect(onSubmitSession).toHaveBeenCalledWith(activeSession)
    expect(screen.getAllByRole('button', { name: 'Submit attempt' })).toHaveLength(2)
  })
})
