import Dexie, { type Table } from 'dexie'
import type { ActiveSession, Attempt } from '../../types'

interface MetaRecord<T = unknown> {
  key: string
  value: T
}

export class ParaPracticeDb extends Dexie {
  attempts!: Table<Attempt, string>
  meta!: Table<MetaRecord, string>

  constructor(name = 'para-practice-db') {
    super(name)

    this.version(1).stores({
      attempts: 'id, completedAt, mode, section, percentCorrect',
      meta: 'key',
    })
  }
}

export const db = new ParaPracticeDb()

export type AppDatabase = ParaPracticeDb

export function createAppDb(name: string) {
  return new ParaPracticeDb(name)
}

export const ACTIVE_SESSION_KEY = 'active-session'

export type ActiveSessionRecord = MetaRecord<ActiveSession>
