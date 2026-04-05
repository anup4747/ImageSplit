export interface AuthUser {
  id: string;
  email: string;
}

const STORAGE_KEY = 'image-splitter-auth-token';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const getToken = () => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(STORAGE_KEY);
};

const setToken = (token: string) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, token);
};

export const clearSession = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
};

const apiFetch = async <T>(path: string, init: RequestInit = {}) => {
  const url = `${API_BASE}${path}`;
  const response = await fetch(url, init);
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error || response.statusText || 'Request failed');
  }

  return payload as T;
};

export const loginUser = async (email: string, password: string) => {
  const result = await apiFetch<{ user: AuthUser; token: string }>('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  setToken(result.token);
  return result.user;
};

export interface RegisterResult {
  user: AuthUser;
  token: string | null;
  message?: string | null;
}

export const registerUser = async (email: string, password: string): Promise<RegisterResult> => {
  const result = await apiFetch<RegisterResult>('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (result.token) {
    setToken(result.token);
  }

  return result;
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  const token = getToken();
  if (!token) return null;

  try {
    const result = await apiFetch<{ user: AuthUser }>('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return result.user;
  } catch {
    clearSession();
    return null;
  }
};
