import { API_BASE } from './apiConfig';
import { apiFetch } from './apiFetch';

export async function registerUser(name, email, password, sessionId) {
  const res = await apiFetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, session_id: sessionId || undefined }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || 'Não foi possível criar sua conta.');
  }
  return res.json();
}

export async function loginUser(email, password, sessionId) {
  const res = await apiFetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, session_id: sessionId || undefined }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || 'Não foi possível entrar na sua conta.');
  }
  return res.json();
}

export async function fetchCurrentUser(token) {
  const res = await apiFetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Sua sessão expirou. Entre novamente.');
  return res.json();
}