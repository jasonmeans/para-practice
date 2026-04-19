import { hasSupabaseConfig, supabase } from '../supabase/client'

export interface AuthUser {
  id: string
  email: string
}

export interface AuthSession {
  user: AuthUser
}

export interface SignUpResult {
  sessionCreated: boolean
}

export const backendMode = hasSupabaseConfig ? 'supabase' : 'local'
const localApiBaseUrl =
  import.meta.env.VITE_LOCAL_API_BASE_URL?.replace(/\/+$/, '') ?? ''
const localSessionTokenKey = 'para_practice_local_auth_token'

interface LocalAuthPayload {
  session?: {
    token?: string
  } | null
}

function hasLocalStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function getLocalSessionToken() {
  if (!hasLocalStorage()) {
    return null
  }

  return window.localStorage.getItem(localSessionTokenKey)
}

function storeLocalSessionToken(token?: string | null) {
  if (!hasLocalStorage()) {
    return
  }

  if (token) {
    window.localStorage.setItem(localSessionTokenKey, token)
    return
  }

  window.localStorage.removeItem(localSessionTokenKey)
}

function mapSupabaseSession(session: {
  user: { id: string; email?: string | null }
} | null): AuthSession | null {
  if (!session?.user.id || !session.user.email) {
    return null
  }

  return {
    user: {
      id: session.user.id,
      email: session.user.email,
    },
  }
}

async function parseLocalResponse<T>(response: Response): Promise<T> {
  const text = await response.text()
  const payload = text ? (JSON.parse(text) as T & { error?: string }) : null

  if (!response.ok) {
    throw new Error(
      (payload && typeof payload === 'object' && 'error' in payload
        ? payload.error
        : null) ||
        response.statusText ||
        'Request failed'
    )
  }

  return payload as T
}

export async function localApiRequest<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const headers = new Headers(init.headers)
  const sessionToken = getLocalSessionToken()

  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  if (sessionToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${sessionToken}`)
  }

  const response = await fetch(`${localApiBaseUrl}${path}`, {
    ...init,
    credentials: localApiBaseUrl ? 'omit' : 'include',
    headers,
  })

  return parseLocalResponse<T>(response)
}

export async function getAuthSession(): Promise<AuthSession | null> {
  if (supabase) {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      throw error
    }

    return mapSupabaseSession(session)
  }

  const payload = await localApiRequest<{ session: AuthSession | null }>(
    '/api/auth/session'
  )
  return payload.session
}

export async function signIn(email: string, password: string) {
  if (supabase) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw error
    }

    return
  }

  const payload = await localApiRequest<
    {
      user: AuthUser
    } & LocalAuthPayload
  >('/api/auth/sign-in', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

  storeLocalSessionToken(payload.session?.token ?? null)
}

export async function signUp(
  email: string,
  password: string
): Promise<SignUpResult> {
  if (supabase) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          learner_name: 'Dove',
        },
      },
    })

    if (error) {
      throw error
    }

    return {
      sessionCreated: Boolean(data.session),
    }
  }

  const payload = await localApiRequest<
    {
      user: AuthUser
    } & LocalAuthPayload
  >('/api/auth/sign-up', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

  storeLocalSessionToken(payload.session?.token ?? null)

  return {
    sessionCreated: true,
  }
}

export async function signOut() {
  if (supabase) {
    const { error } = await supabase.auth.signOut()

    if (error) {
      throw error
    }

    return
  }

  await localApiRequest('/api/auth/sign-out', {
    method: 'POST',
  })

  storeLocalSessionToken(null)
}
