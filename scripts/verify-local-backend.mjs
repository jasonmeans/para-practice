import { spawn } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { setTimeout as delay } from 'node:timers/promises'

const port = 4317
const baseUrl = `http://127.0.0.1:${port}`

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

async function request(path, init = {}, cookie = '') {
  const headers = new Headers(init.headers)

  if (cookie) {
    headers.set('Cookie', cookie)
  }

  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers,
  })
  const text = await response.text()
  const payload = text ? JSON.parse(text) : null

  return {
    response,
    payload,
    cookie:
      response.headers.getSetCookie?.()[0] ??
      response.headers.get('set-cookie') ??
      cookie,
  }
}

async function requestWithToken(path, token, init = {}) {
  const headers = new Headers(init.headers)
  headers.set('Authorization', `Bearer ${token}`)
  return request(path, { ...init, headers })
}

async function waitForHealth() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}/api/health`)

      if (response.ok) {
        return
      }
    } catch {
      // retry
    }

    await delay(250)
  }

  throw new Error('Local backend did not become ready in time.')
}

const server = spawn('node', ['server/index.mjs'], {
  cwd: process.cwd(),
  env: {
    ...process.env,
    HOST: '127.0.0.1',
    PORT: String(port),
  },
  stdio: ['ignore', 'pipe', 'pipe'],
})

server.stdout.on('data', (chunk) => process.stdout.write(chunk))
server.stderr.on('data', (chunk) => process.stderr.write(chunk))

try {
  await waitForHealth()

  const rootResponse = await fetch(baseUrl)
  const rootHtml = await rootResponse.text()
  assert(rootResponse.ok, 'Expected the root page to load successfully.')
  assert(
    rootHtml.includes('ParaPro') || rootHtml.includes('Dove'),
    'Expected the built app shell to be served.'
  )

  const email = `dove-${randomUUID()}@example.com`
  const password = 'practice-mode-123'

  const signUp = await request('/api/auth/sign-up', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  assert(signUp.response.status === 201, 'Expected sign-up to succeed.')
  assert(signUp.cookie.includes('para_practice_session='), 'Expected session cookie.')
  assert(
    typeof signUp.payload.session?.token === 'string' &&
      signUp.payload.session.token.length > 0,
    'Expected sign-up to return a bearer token.'
  )

  const token = signUp.payload.session.token

  const preflight = await request('/api/history', {
    method: 'OPTIONS',
    headers: {
      Origin: 'https://jasonmeans.github.io',
      'Access-Control-Request-Method': 'GET',
      'Access-Control-Request-Headers': 'authorization,content-type',
    },
  })
  assert(preflight.response.status === 204, 'Expected CORS preflight to succeed.')
  assert(
    preflight.response.headers.get('access-control-allow-origin') ===
      'https://jasonmeans.github.io',
    'Expected CORS preflight to allow the GitHub Pages origin.'
  )

  const activeSession = {
    id: randomUUID(),
    startedAt: new Date().toISOString(),
    paused: false,
    elapsedSeconds: 90,
    currentIndex: 1,
    config: {
      mode: 'section-quiz',
      count: 2,
      section: 'math',
      title: 'Math Quiz',
    },
    questionIds: ['math-ratios-1', 'math-fractions-1'],
    answers: {
      'math-ratios-1': {
        questionId: 'math-ratios-1',
        selectedOption: 2,
        confidence: 2,
      },
      'math-fractions-1': {
        questionId: 'math-fractions-1',
        selectedOption: null,
      },
    },
  }

  const attempt = {
    id: randomUUID(),
    startedAt: new Date(Date.now() - 10 * 60_000).toISOString(),
    completedAt: new Date().toISOString(),
    mode: 'section-quiz',
    title: 'Math Quiz',
    count: 2,
    section: 'math',
    questionIds: ['math-ratios-1', 'math-fractions-1'],
    answers: [
      {
        questionId: 'math-ratios-1',
        section: 'math',
        topic: 'ratios',
        selectedOption: 2,
        correctAnswer: 2,
        isCorrect: true,
        confidence: 2,
      },
      {
        questionId: 'math-fractions-1',
        section: 'math',
        topic: 'fractions',
        selectedOption: 1,
        correctAnswer: 3,
        isCorrect: false,
      },
    ],
    sectionBreakdown: [{ section: 'math', correct: 1, total: 2, percent: 50 }],
    totalCorrect: 1,
    percentCorrect: 50,
    durationSeconds: 600,
    weakTopics: ['fractions'],
    missedQuestionIds: ['math-fractions-1'],
    recommendedFocus: ['Math refresh', 'fractions'],
  }

  const saveSession = await requestWithToken(
    '/api/history/active-session',
    token,
    {
      method: 'PUT',
      headers: {
        Origin: 'https://jasonmeans.github.io',
      },
      body: JSON.stringify({ session: activeSession }),
    }
  )
  assert(saveSession.response.ok, 'Expected active session save to succeed.')

  const saveAttempt = await requestWithToken(
    '/api/history/attempts',
    token,
    {
      method: 'PUT',
      headers: {
        Origin: 'https://jasonmeans.github.io',
      },
      body: JSON.stringify({ attempt }),
    }
  )
  assert(saveAttempt.response.ok, 'Expected attempt save to succeed.')

  const history = await requestWithToken(
    '/api/history',
    token,
    {
      headers: {
        Origin: 'https://jasonmeans.github.io',
      },
    }
  )
  assert(history.response.ok, 'Expected history fetch to succeed.')
  assert(history.payload.attempts.length === 1, 'Expected one saved attempt.')
  assert(
    history.payload.attempts[0].id === attempt.id,
    'Expected the saved attempt to round-trip.'
  )
  assert(
    history.payload.activeSession?.id === activeSession.id,
    'Expected the active session to round-trip.'
  )

  console.log(
    `Verified local backend persistence for ${email}: 1 attempt and 1 active session saved.`
  )
} finally {
  server.kill('SIGTERM')
  await delay(500)
}
