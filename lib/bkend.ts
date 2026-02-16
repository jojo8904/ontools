/**
 * bkend.ai BaaS Client
 * REST Service API Client for ontools project
 */

const API_BASE =
  process.env.NEXT_PUBLIC_BKEND_API_URL || 'https://api-client.bkend.ai/v1'
const PROJECT_ID = process.env.NEXT_PUBLIC_BKEND_PROJECT_ID!
const ENVIRONMENT = process.env.NEXT_PUBLIC_BKEND_ENV || 'dev'

interface BkendRequestOptions extends RequestInit {
  skipAuth?: boolean
}

async function bkendFetch(
  path: string,
  options: BkendRequestOptions = {}
) {
  const { skipAuth, ...fetchOptions } = options

  // Get token from localStorage (client-side only)
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('bkend_access_token')
      : null

  const res = await fetch(`${API_BASE}${path}`, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      'x-project-id': PROJECT_ID,
      'x-environment': ENVIRONMENT,
      ...(token && !skipAuth && { Authorization: `Bearer ${token}` }),
      ...fetchOptions.headers,
    },
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(errorText || `HTTP ${res.status}: ${res.statusText}`)
  }

  return res.json()
}

export const bkend = {
  /**
   * Authentication API
   */
  auth: {
    signup: (body: { email: string; password: string }) =>
      bkendFetch('/auth/email/signup', {
        method: 'POST',
        body: JSON.stringify(body),
        skipAuth: true,
      }),

    signin: (body: { email: string; password: string }) =>
      bkendFetch('/auth/email/signin', {
        method: 'POST',
        body: JSON.stringify(body),
        skipAuth: true,
      }),

    me: () => bkendFetch('/auth/me'),

    refresh: (refreshToken: string) =>
      bkendFetch('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
        skipAuth: true,
      }),

    signout: () => bkendFetch('/auth/signout', { method: 'POST' }),
  },

  /**
   * Data API (Tables)
   */
  data: {
    list: (table: string, params?: Record<string, string>) =>
      bkendFetch(
        `/data/${table}${params ? '?' + new URLSearchParams(params) : ''}`
      ),

    get: (table: string, id: string) =>
      bkendFetch(`/data/${table}/${id}`),

    create: (table: string, body: any) =>
      bkendFetch(`/data/${table}`, {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    update: (table: string, id: string, body: any) =>
      bkendFetch(`/data/${table}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),

    delete: (table: string, id: string) =>
      bkendFetch(`/data/${table}/${id}`, {
        method: 'DELETE',
      }),
  },
}

/**
 * Token management utilities
 */
export const tokenManager = {
  setToken: (accessToken: string, refreshToken?: string) => {
    if (typeof window === 'undefined') return

    localStorage.setItem('bkend_access_token', accessToken)
    if (refreshToken) {
      localStorage.setItem('bkend_refresh_token', refreshToken)
    }
  },

  getToken: () => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('bkend_access_token')
  },

  getRefreshToken: () => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('bkend_refresh_token')
  },

  clearTokens: () => {
    if (typeof window === 'undefined') return
    localStorage.removeItem('bkend_access_token')
    localStorage.removeItem('bkend_refresh_token')
  },
}
