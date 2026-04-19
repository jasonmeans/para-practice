import type {
  ActiveSession,
  Attempt,
  HistoryExport,
  LearnerHistoryState,
} from '../../types'
import { localApiRequest } from './authService'
import { hasSupabaseConfig, requireSupabase } from '../supabase/client'

export interface AttemptRecord {
  id: string
  user_id: string
  completed_at: string
  percent_correct: number
  mode: Attempt['mode']
  section: Attempt['section'] | null
  question_count: number
  payload: Attempt
}

export interface ActiveSessionRecord {
  user_id: string
  updated_at: string
  payload: ActiveSession
}

function isAttempt(value: unknown): value is Attempt {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Attempt
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.completedAt === 'string' &&
    Array.isArray(candidate.answers) &&
    Array.isArray(candidate.questionIds)
  )
}

export function isHistoryExport(value: unknown): value is HistoryExport {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as HistoryExport
  return (
    typeof candidate.version === 'number' &&
    typeof candidate.exportedAt === 'string' &&
    Array.isArray(candidate.attempts) &&
    candidate.attempts.every(isAttempt)
  )
}

export function toAttemptRecord(
  userId: string,
  attempt: Attempt
): AttemptRecord {
  return {
    id: attempt.id,
    user_id: userId,
    completed_at: attempt.completedAt,
    percent_correct: attempt.percentCorrect,
    mode: attempt.mode,
    section: attempt.section ?? null,
    question_count: attempt.count,
    payload: attempt,
  }
}

export function fromAttemptRecord(record: Pick<AttemptRecord, 'payload'>) {
  return record.payload
}

export function toActiveSessionRecord(
  userId: string,
  session: ActiveSession
): ActiveSessionRecord {
  return {
    user_id: userId,
    updated_at: new Date().toISOString(),
    payload: session,
  }
}

export function fromActiveSessionRecord(
  record?: Pick<ActiveSessionRecord, 'payload'>
) {
  return record?.payload
}

function isNoRowsError(error: { code?: string } | null) {
  return error?.code === 'PGRST116'
}

export async function fetchLearnerHistory(
  userId: string
): Promise<LearnerHistoryState> {
  if (!hasSupabaseConfig) {
    return localApiRequest<LearnerHistoryState>('/api/history')
  }

  const client = requireSupabase()
  const [
    { data: attemptsData, error: attemptsError },
    { data: sessionData, error: sessionError },
  ] = await Promise.all([
    client
      .from('attempts')
      .select('payload')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false }),
    client
      .from('active_sessions')
      .select('payload')
      .eq('user_id', userId)
      .maybeSingle(),
  ])

  if (attemptsError) {
    throw attemptsError
  }

  if (sessionError && !isNoRowsError(sessionError)) {
    throw sessionError
  }

  return {
    attempts: (attemptsData ?? []).map(fromAttemptRecord),
    activeSession: fromActiveSessionRecord(sessionData ?? undefined),
  }
}

export async function saveAttempt(userId: string, attempt: Attempt) {
  if (!hasSupabaseConfig) {
    await localApiRequest('/api/history/attempts', {
      method: 'PUT',
      body: JSON.stringify({ attempt }),
    })
    return
  }

  const client = requireSupabase()
  const record = toAttemptRecord(userId, attempt)
  const { error } = await client.from('attempts').upsert(record, {
    onConflict: 'id',
  })

  if (error) {
    throw error
  }
}

export async function saveActiveSession(
  userId: string,
  session: ActiveSession
) {
  if (!hasSupabaseConfig) {
    await localApiRequest('/api/history/active-session', {
      method: 'PUT',
      body: JSON.stringify({ session }),
    })
    return
  }

  const client = requireSupabase()
  const record = toActiveSessionRecord(userId, session)
  const { error } = await client.from('active_sessions').upsert(record, {
    onConflict: 'user_id',
  })

  if (error) {
    throw error
  }
}

export async function clearActiveSession(userId: string) {
  if (!hasSupabaseConfig) {
    await localApiRequest('/api/history/active-session', {
      method: 'DELETE',
    })
    return
  }

  const client = requireSupabase()
  const { error } = await client
    .from('active_sessions')
    .delete()
    .eq('user_id', userId)

  if (error) {
    throw error
  }
}

export async function clearAllHistory(userId: string) {
  if (!hasSupabaseConfig) {
    await localApiRequest('/api/history', {
      method: 'DELETE',
    })
    return
  }

  const client = requireSupabase()
  const [{ error: attemptsError }, { error: sessionError }] = await Promise.all(
    [
      client.from('attempts').delete().eq('user_id', userId),
      client.from('active_sessions').delete().eq('user_id', userId),
    ]
  )

  if (attemptsError) {
    throw attemptsError
  }

  if (sessionError) {
    throw sessionError
  }
}

export function exportHistory(
  attempts: Attempt[],
  activeSession?: ActiveSession
): HistoryExport {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    attempts,
    activeSession,
  }
}

export async function importHistory(userId: string, payload: HistoryExport) {
  if (!isHistoryExport(payload)) {
    throw new Error('Invalid history file')
  }

  if (!hasSupabaseConfig) {
    const response = await localApiRequest<{ imported: number }>(
      '/api/history/import',
      {
        method: 'POST',
        body: JSON.stringify({ payload }),
      }
    )

    return response.imported
  }

  const client = requireSupabase()

  if (payload.attempts.length > 0) {
    const attemptRecords = payload.attempts.map((attempt) =>
      toAttemptRecord(userId, attempt)
    )
    const { error: attemptsError } = await client
      .from('attempts')
      .upsert(attemptRecords, { onConflict: 'id' })

    if (attemptsError) {
      throw attemptsError
    }
  }

  if (payload.activeSession) {
    await saveActiveSession(userId, payload.activeSession)
  }

  return payload.attempts.length
}
