export interface AuthorizationPayload {
  id: string
  token: string
}

const AUTH_KEY = 'ohbug_authorization'

export function getAuth(): AuthorizationPayload | null {
  const auth = localStorage.getItem(AUTH_KEY)
  return auth ? JSON.parse(auth) : null
}
export function setAuth(payload: AuthorizationPayload) {
  return localStorage.setItem(AUTH_KEY, JSON.stringify(payload))
}
export function clearAuth() {
  return localStorage.removeItem(AUTH_KEY)
}
