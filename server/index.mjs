import { createServer } from 'node:http'
import { pbkdf2Sync, randomBytes, timingSafeEqual } from 'node:crypto'
import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { readFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

const HOST = process.env.HOST ?? '0.0.0.0'
const PORT = Number(process.env.PORT ?? 3000)
const SESSION_COOKIE = 'para_practice_session'
const DEFAULT_ALLOWED_ORIGINS = [
  'http://127.0.0.1:3000',
  'http://localhost:3000',
  'http://127.0.0.1:3100',
  'http://localhost:3100',
  'https://jasonmeans.github.io',
]
const ALLOWED_ORIGINS = new Set(
  [
    ...DEFAULT_ALLOWED_ORIGINS,
    ...(process.env.ALLOWED_ORIGINS ?? '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean),
  ].filter(Boolean)
)
const DIST_DIR = path.resolve(process.cwd(), 'dist')
const DEFAULT_DATA_DIR = path.join(os.homedir(), '.para-practice-local')
const DATA_FILE = process.env.DATA_FILE
  ? path.resolve(process.cwd(), process.env.DATA_FILE)
  : path.join(
      process.env.DATA_DIR
        ? path.resolve(process.cwd(), process.env.DATA_DIR)
        : DEFAULT_DATA_DIR,
      'store.json'
    )
const DATA_DIR = path.dirname(DATA_FILE)

function defaultStore() {
  return {
    users: [],
    sessions: [],
    attemptsByUser: {},
    activeSessionsByUser: {},
  }
}

function ensureDataDir() {
  mkdirSync(DATA_DIR, { recursive: true })
}

function loadStore() {
  ensureDataDir()

  if (!existsSync(DATA_FILE)) {
    return defaultStore()
  }

  const raw = JSON.parse(readFileSync(DATA_FILE, 'utf8'))
  return {
    ...defaultStore(),
    ...raw,
    users: Array.isArray(raw.users) ? raw.users : [],
    sessions: Array.isArray(raw.sessions) ? raw.sessions : [],
    attemptsByUser: raw.attemptsByUser ?? {},
    activeSessionsByUser: raw.activeSessionsByUser ?? {},
  }
}

let store = loadStore()

function saveStore() {
  ensureDataDir()
  const tempFile = `${DATA_FILE}.tmp`
  writeFileSync(tempFile, JSON.stringify(store, null, 2))
  renameSync(tempFile, DATA_FILE)
}

function parseCookies(cookieHeader = '') {
  return cookieHeader.split(';').reduce((accumulator, fragment) => {
    const [rawName, ...rest] = fragment.trim().split('=')

    if (!rawName) {
      return accumulator
    }

    accumulator[rawName] = decodeURIComponent(rest.join('='))
    return accumulator
  }, {})
}

function setCookie(response, value) {
  response.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE}=${value}; Path=/; HttpOnly; SameSite=Lax`
  )
}

function clearCookie(response) {
  response.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
  )
}

function hashPassword(password, salt = randomBytes(16).toString('hex')) {
  const hash = pbkdf2Sync(password, salt, 310000, 32, 'sha256').toString('hex')
  return `${salt}:${hash}`
}

function verifyPassword(password, storedValue) {
  const [salt, existingHash] = storedValue.split(':')
  const candidate = pbkdf2Sync(password, salt, 310000, 32, 'sha256')
  const expected = Buffer.from(existingHash, 'hex')
  return (
    candidate.length === expected.length && timingSafeEqual(candidate, expected)
  )
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  })
  response.end(JSON.stringify(payload))
}

function sendEmpty(response, statusCode) {
  response.writeHead(statusCode, {
    'Cache-Control': 'no-store',
  })
  response.end()
}

function sendError(response, statusCode, message) {
  sendJson(response, statusCode, { error: message })
}

function applyCors(request, response) {
  const origin = request.headers.origin

  if (!origin || !ALLOWED_ORIGINS.has(origin)) {
    return
  }

  response.setHeader('Access-Control-Allow-Origin', origin)
  response.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type')
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.setHeader('Access-Control-Max-Age', '600')
  response.setHeader('Vary', 'Origin')
}

async function readJsonBody(request) {
  const chunks = []

  for await (const chunk of request) {
    chunks.push(chunk)
  }

  if (chunks.length === 0) {
    return {}
  }

  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}

function getSessionRecord(request) {
  const authorization = request.headers.authorization
  const bearerPrefix = 'Bearer '
  const authorizationToken =
    typeof authorization === 'string' && authorization.startsWith(bearerPrefix)
      ? authorization.slice(bearerPrefix.length).trim()
      : ''
  const cookies = parseCookies(request.headers.cookie)
  const token = authorizationToken || cookies[SESSION_COOKIE]

  if (!token) {
    return null
  }

  return store.sessions.find((session) => session.id === token) ?? null
}

function getAuthenticatedUser(request) {
  const session = getSessionRecord(request)

  if (!session) {
    return null
  }

  return store.users.find((user) => user.id === session.userId) ?? null
}

function sortAttempts(attempts = []) {
  return [...attempts].sort(
    (left, right) =>
      new Date(right.completedAt).getTime() -
      new Date(left.completedAt).getTime()
  )
}

function upsertAttempt(userId, attempt) {
  const attempts = store.attemptsByUser[userId] ?? []
  const nextAttempts = attempts.filter((entry) => entry.id !== attempt.id)
  nextAttempts.push(attempt)
  store.attemptsByUser[userId] = sortAttempts(nextAttempts)
}

function contentTypeFor(filePath) {
  const extension = path.extname(filePath)

  switch (extension) {
    case '.css':
      return 'text/css; charset=utf-8'
    case '.js':
      return 'application/javascript; charset=utf-8'
    case '.json':
      return 'application/json; charset=utf-8'
    case '.svg':
      return 'image/svg+xml'
    case '.ico':
      return 'image/x-icon'
    case '.html':
    default:
      return 'text/html; charset=utf-8'
  }
}

async function serveFile(response, filePath) {
  const body = await readFile(filePath)
  response.writeHead(200, {
    'Content-Type': contentTypeFor(filePath),
  })
  response.end(body)
}

function validateCredentials(email, password) {
  if (typeof email !== 'string' || !email.includes('@')) {
    return 'Enter a valid email address.'
  }

  if (typeof password !== 'string' || password.length < 8) {
    return 'Use a password with at least 8 characters.'
  }

  return null
}

function createSession(response, userId) {
  const sessionId = randomBytes(24).toString('hex')
  store.sessions = store.sessions.filter((entry) => entry.userId !== userId)
  store.sessions.push({
    id: sessionId,
    userId,
    createdAt: new Date().toISOString(),
  })
  saveStore()
  setCookie(response, sessionId)
  return sessionId
}

function clearSession(request, response) {
  const currentSession = getSessionRecord(request)

  if (currentSession) {
    store.sessions = store.sessions.filter(
      (session) => session.id !== currentSession.id
    )
    saveStore()
  }

  clearCookie(response)
}

function isHistoryPayload(payload) {
  return (
    payload &&
    typeof payload === 'object' &&
    Array.isArray(payload.attempts) &&
    typeof payload.version === 'number'
  )
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', `http://${request.headers.host}`)

  try {
    applyCors(request, response)

    if (request.method === 'OPTIONS') {
      sendEmpty(response, 204)
      return
    }

    if (request.method === 'GET' && url.pathname === '/api/health') {
      sendJson(response, 200, { ok: true, mode: 'local' })
      return
    }

    if (request.method === 'GET' && url.pathname === '/api/auth/session') {
      const user = getAuthenticatedUser(request)
      sendJson(response, 200, {
        session: user
          ? {
              user: {
                id: user.id,
                email: user.email,
              },
            }
          : null,
      })
      return
    }

    if (request.method === 'POST' && url.pathname === '/api/auth/sign-up') {
      const body = await readJsonBody(request)
      const message = validateCredentials(body.email, body.password)

      if (message) {
        sendError(response, 400, message)
        return
      }

      const normalizedEmail = body.email.trim().toLowerCase()

      if (store.users.some((user) => user.email === normalizedEmail)) {
        sendError(response, 409, 'That email already has an account.')
        return
      }

      const user = {
        id: randomBytes(16).toString('hex'),
        email: normalizedEmail,
        passwordHash: hashPassword(body.password),
        createdAt: new Date().toISOString(),
      }

      store.users.push(user)
      saveStore()
      const sessionToken = createSession(response, user.id)
      sendJson(response, 201, {
        session: {
          token: sessionToken,
        },
        user: {
          id: user.id,
          email: user.email,
        },
      })
      return
    }

    if (request.method === 'POST' && url.pathname === '/api/auth/sign-in') {
      const body = await readJsonBody(request)
      const normalizedEmail =
        typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
      const user = store.users.find((entry) => entry.email === normalizedEmail)

      if (!user || !verifyPassword(body.password ?? '', user.passwordHash)) {
        sendError(response, 401, 'The email or password did not match.')
        return
      }

      const sessionToken = createSession(response, user.id)
      sendJson(response, 200, {
        session: {
          token: sessionToken,
        },
        user: {
          id: user.id,
          email: user.email,
        },
      })
      return
    }

    if (request.method === 'POST' && url.pathname === '/api/auth/sign-out') {
      clearSession(request, response)
      sendEmpty(response, 204)
      return
    }

    const user = getAuthenticatedUser(request)

    if (url.pathname.startsWith('/api/history') && !user) {
      sendError(response, 401, 'Sign in is required before accessing history.')
      return
    }

    if (request.method === 'GET' && url.pathname === '/api/history') {
      sendJson(response, 200, {
        attempts: sortAttempts(store.attemptsByUser[user.id] ?? []),
        activeSession: store.activeSessionsByUser[user.id],
      })
      return
    }

    if (
      request.method === 'PUT' &&
      url.pathname === '/api/history/active-session'
    ) {
      const body = await readJsonBody(request)
      store.activeSessionsByUser[user.id] = body.session
      saveStore()
      sendJson(response, 200, { ok: true })
      return
    }

    if (
      request.method === 'DELETE' &&
      url.pathname === '/api/history/active-session'
    ) {
      delete store.activeSessionsByUser[user.id]
      saveStore()
      sendEmpty(response, 204)
      return
    }

    if (request.method === 'PUT' && url.pathname === '/api/history/attempts') {
      const body = await readJsonBody(request)
      upsertAttempt(user.id, body.attempt)
      saveStore()
      sendJson(response, 200, { ok: true })
      return
    }

    if (request.method === 'POST' && url.pathname === '/api/history/import') {
      const body = await readJsonBody(request)
      const payload = body.payload

      if (!isHistoryPayload(payload)) {
        sendError(response, 400, 'Invalid history file')
        return
      }

      for (const attempt of payload.attempts) {
        upsertAttempt(user.id, attempt)
      }

      if (payload.activeSession) {
        store.activeSessionsByUser[user.id] = payload.activeSession
      }

      saveStore()
      sendJson(response, 200, { imported: payload.attempts.length })
      return
    }

    if (request.method === 'DELETE' && url.pathname === '/api/history') {
      store.attemptsByUser[user.id] = []
      delete store.activeSessionsByUser[user.id]
      saveStore()
      sendEmpty(response, 204)
      return
    }

    if (url.pathname.startsWith('/api/')) {
      sendError(response, 404, 'Not found')
      return
    }

    if (!existsSync(DIST_DIR)) {
      sendError(
        response,
        503,
        'The app has not been built yet. Run npm run build first.'
      )
      return
    }

    const requestedPath =
      url.pathname === '/'
        ? path.join(DIST_DIR, 'index.html')
        : path.join(DIST_DIR, decodeURIComponent(url.pathname))
    const normalizedPath = path.normalize(requestedPath)

    if (
      normalizedPath.startsWith(DIST_DIR) &&
      existsSync(normalizedPath) &&
      statSync(normalizedPath).isFile()
    ) {
      await serveFile(response, normalizedPath)
      return
    }

    await serveFile(response, path.join(DIST_DIR, 'index.html'))
  } catch (error) {
    sendError(
      response,
      500,
      error instanceof Error ? error.message : 'Internal server error'
    )
  }
})

server.listen(PORT, HOST, () => {
  console.log(`Para Practice server listening on http://${HOST}:${PORT}`)
})
