import { describe, expect, it } from 'vitest'
import type { Question } from '../../types'
import { buildFriendlyReview } from './explanations'

function makeQuestion(overrides: Partial<Question>): Question {
  return {
    id: 'question-1',
    section: 'reading',
    topic: 'main idea',
    difficulty: 'foundation',
    prompt: 'Prompt',
    options: ['Choice A', 'Choice B', 'Choice C', 'Choice D'],
    correctAnswer: 0,
    explanation: 'Because it matches the main point.',
    tags: [],
    ...overrides,
  }
}

describe('buildFriendlyReview', () => {
  it('builds clue-focused coaching for inference questions', () => {
    const question = makeQuestion({
      section: 'reading',
      topic: 'inference',
      correctAnswer: 1,
    })

    const review = buildFriendlyReview(question, {
      selectedOption: 0,
      isCorrect: false,
    })

    expect(review.correctChoice.label).toBe('B')
    expect(review.selectedChoice?.label).toBe('A')
    expect(review.simpleReason.toLowerCase()).toContain('clue')
    expect(review.nextTimeSteps.join(' ').toLowerCase()).toContain('clues')
  })

  it('gives part-and-whole coaching for fraction-style math', () => {
    const question = makeQuestion({
      section: 'math',
      topic: 'fractions',
      correctAnswer: 2,
      options: ['1/2', '2/3', '3/4', '4/5'],
    })

    const review = buildFriendlyReview(question, {
      selectedOption: 1,
      isCorrect: false,
    })

    expect(review.correctChoice.label).toBe('C')
    expect(review.simpleReason.toLowerCase()).toContain('whole')
    expect(review.nextTimeSteps.join(' ').toLowerCase()).toContain('part')
  })

  it('uses punctuation guidance for writing mechanics questions', () => {
    const question = makeQuestion({
      section: 'writing',
      topic: 'quotation punctuation',
    })

    const review = buildFriendlyReview(question, {
      selectedOption: 0,
      isCorrect: true,
    })

    expect(review.coachingTitle).toBe('How to do it again')
    expect(review.simpleReason.toLowerCase()).toContain('road signs')
    expect(review.nextTimeSteps.join(' ').toLowerCase()).toContain('pause')
  })

  it('handles unanswered questions with a gentle status message', () => {
    const question = makeQuestion({
      section: 'instructional-support',
      topic: 'behavior support',
    })

    const review = buildFriendlyReview(question, {
      selectedOption: null,
      isCorrect: false,
    })

    expect(review.selectedChoice).toBeUndefined()
    expect(review.statusMessage.toLowerCase()).toContain('blank')
    expect(review.nextTimeSteps.join(' ').toLowerCase()).toContain('safe')
  })
})
