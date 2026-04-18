export const SECTIONS = [
  'reading',
  'writing',
  'math',
  'instructional-support',
] as const

export type Section = (typeof SECTIONS)[number]

export type Difficulty = 'foundation' | 'core' | 'stretch'
export type ThemePreference = 'system' | 'light' | 'dark'
export type ResolvedTheme = 'light' | 'dark'

export type QuizMode =
  | 'full-test'
  | 'section-quiz'
  | 'weak-area'
  | 'missed-only'

export interface Question {
  id: string
  section: Section
  topic: string
  difficulty: Difficulty
  prompt: string
  options: string[]
  correctAnswer: number
  explanation: string
  tags: string[]
  scenario?: string
}

export interface QuizConfig {
  mode: QuizMode
  count: number
  section?: Section
  title: string
}

export interface SessionAnswer {
  questionId: string
  selectedOption: number | null
  confidence?: 1 | 2 | 3
}

export interface ActiveSession {
  id: string
  startedAt: string
  lastResumedAt?: string
  paused: boolean
  elapsedSeconds: number
  currentIndex: number
  config: QuizConfig
  questionIds: string[]
  answers: Record<string, SessionAnswer>
}

export interface SectionScore {
  section: Section
  correct: number
  total: number
  percent: number
}

export interface AttemptAnswer {
  questionId: string
  section: Section
  topic: string
  selectedOption: number | null
  correctAnswer: number
  isCorrect: boolean
  confidence?: 1 | 2 | 3
}

export interface Attempt {
  id: string
  startedAt: string
  completedAt: string
  mode: QuizMode
  title: string
  count: number
  section?: Section
  questionIds: string[]
  answers: AttemptAnswer[]
  sectionBreakdown: SectionScore[]
  totalCorrect: number
  percentCorrect: number
  durationSeconds: number
  weakTopics: string[]
  missedQuestionIds: string[]
  recommendedFocus: string[]
}

export interface HistoryExport {
  version: number
  exportedAt: string
  attempts: Attempt[]
  activeSession?: ActiveSession
}

export interface SectionPerformance {
  section: Section
  averagePercent: number
  totalQuestions: number
}

export interface TopicTrend {
  topic: string
  misses: number
  attemptsSeen: number
}

export interface LearnerInsights {
  attemptCount: number
  overallAverage: number
  recentAverage: number
  bestScore: number
  strongestSection?: SectionPerformance
  weakestSection?: SectionPerformance
  recurringTopics: TopicTrend[]
  trendDirection: 'improving' | 'flat' | 'declining' | 'insufficient-data'
  trendDelta: number
  recommendedFocusAreas: string[]
  studyTips: string[]
}

export interface LearnerHistoryState {
  attempts: Attempt[]
  activeSession?: ActiveSession
}
