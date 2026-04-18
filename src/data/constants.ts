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
  'Your attempts and saved sessions sync to your study account so you can continue on desktop or phone.'

export const APP_TITLE = "Dove's ParaPro Practice"
export const APP_SUBTITLE =
  'A calm, original study space for ParaPro (1755) practice'
export const THEME_STORAGE_KEY = 'para-practice-theme-preference'
export const DOVE_HERO_IMAGE =
  'https://images.unsplash.com/photo-1768195355020-751b8f3e6799?auto=format&fit=crop&w=1600&q=80'
export const DOVE_PORTRAIT_IMAGE =
  'https://images.unsplash.com/photo-1570557242726-2290ca262703?auto=format&fit=crop&w=1400&q=80'
