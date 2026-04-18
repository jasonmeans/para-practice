import type { QuizMode, Section } from '../types'

export const SECTION_LABELS: Record<Section, string> = {
  reading: 'Reading',
  writing: 'Writing',
  math: 'Math',
  'instructional-support': 'Classroom Application',
}

export const QUIZ_MODE_LABELS: Record<QuizMode, string> = {
  'full-test': 'Full Practice Test',
  'section-quiz': 'Section Quiz',
  'weak-area': 'Weak-Area Quiz',
  'missed-only': 'Missed Questions Review',
}

export const FULL_TEST_COUNT_OPTIONS = [16, 24, 32]
export const SECTION_QUIZ_COUNT_OPTIONS = [8, 12, 16]
export const FOCUSED_QUIZ_COUNT_OPTIONS = [8, 10, 12]

export const STORAGE_NOTE =
  'Your attempts stay only in this browser on this device unless you export them yourself.'

export const APP_TITLE = 'ParaPro Practice Studio'
