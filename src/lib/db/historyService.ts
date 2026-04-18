import {
  ACTIVE_SESSION_KEY,
  db,
  type ActiveSessionRecord,
  type AppDatabase,
} from './database'
import type { ActiveSession, Attempt, HistoryExport } from '../../types'

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

export async function getAttempts(database: AppDatabase = db) {
  return database.attempts.orderBy('completedAt').reverse().toArray()
}

export async function saveAttempt(
  attempt: Attempt,
  database: AppDatabase = db
) {
  await database.attempts.put(attempt)
}

export async function deleteAttempt(
  attemptId: string,
  database: AppDatabase = db
) {
  await database.attempts.delete(attemptId)
}

export async function getActiveSession(database: AppDatabase = db) {
  const record = await database.meta.get(ACTIVE_SESSION_KEY)
  return record?.value as ActiveSession | undefined
}

export async function saveActiveSession(
  session: ActiveSession,
  database: AppDatabase = db
) {
  const record: ActiveSessionRecord = {
    key: ACTIVE_SESSION_KEY,
    value: session,
  }

  await database.meta.put(record)
}

export async function clearActiveSession(database: AppDatabase = db) {
  await database.meta.delete(ACTIVE_SESSION_KEY)
}

export async function clearAllHistory(database: AppDatabase = db) {
  await database.transaction(
    'rw',
    database.attempts,
    database.meta,
    async () => {
      await database.attempts.clear()
      await database.meta.delete(ACTIVE_SESSION_KEY)
    }
  )
}

export async function exportHistory(
  database: AppDatabase = db
): Promise<HistoryExport> {
  const attempts = await getAttempts(database)
  const activeSession = await getActiveSession(database)

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    attempts,
    activeSession,
  }
}

export async function importHistory(
  payload: HistoryExport,
  database: AppDatabase = db
) {
  if (!isHistoryExport(payload)) {
    throw new Error('Invalid history file')
  }

  await database.transaction(
    'rw',
    database.attempts,
    database.meta,
    async () => {
      await database.attempts.bulkPut(payload.attempts)

      if (payload.activeSession) {
        await saveActiveSession(payload.activeSession, database)
      }
    }
  )

  return payload.attempts.length
}
