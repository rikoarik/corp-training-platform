import { getData, postData, setAuthToken } from '../lib/api';
import type { AuthSession, AuthUser } from '../types/api';

const SESSION_STORAGE_KEY = 'masfita-admin-session';

export async function login(payload: { email: string; password: string }) {
  const session = await postData<AuthSession, { email: string; password: string }>('/auth/login', payload);
  setStoredSession(session);
  return session;
}

export async function fetchMe() {
  return getData<AuthUser>('/auth/me');
}

export async function validateStoredSession() {
  const session = getStoredSession();

  if (!session?.token) {
    return null;
  }

  try {
    const user = await fetchMe();
    const nextSession = {
      ...session,
      user,
    };
    setStoredSession(nextSession);
    return nextSession;
  } catch {
    clearStoredSession();
    return null;
  }
}

export function getStoredSession(): AuthSession | null {
  const rawValue = window.localStorage.getItem(SESSION_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    const session = JSON.parse(rawValue) as AuthSession;
    setAuthToken(session.token);
    return session;
  } catch {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
}

export function setStoredSession(session: AuthSession) {
  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  setAuthToken(session.token);
}

export function clearStoredSession() {
  window.localStorage.removeItem(SESSION_STORAGE_KEY);
  setAuthToken('');
}
