import { API_BASE } from './apiConfig';
import { apiFetch } from './apiFetch';

export async function fetchCart(sessionId) {
  const res = await apiFetch(`${API_BASE}/cart/${sessionId}`);
  if (!res.ok) throw new Error('Não foi possível carregar sua sacola.');
  return res.json();
}

export async function addItemToCart(sessionId, productId, quantity = 1) {
  const res = await apiFetch(`${API_BASE}/cart/${sessionId}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product_id: productId, quantity }),
  });
  if (!res.ok) throw new Error('Não foi possível adicionar o produto à sacola.');
  return res.json();
}

export async function updateItemQuantity(sessionId, itemId, quantity) {
  const res = await apiFetch(`${API_BASE}/cart/${sessionId}/item/${itemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  });
  if (!res.ok) throw new Error('Não foi possível atualizar a quantidade.');
  return res.json();
}

export async function removeItemFromCart(sessionId, itemId) {
  const res = await apiFetch(`${API_BASE}/cart/${sessionId}/item/${itemId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Não foi possível remover o item.');
  return res.json();
}

export async function clearCartApi(sessionId) {
  const res = await apiFetch(`${API_BASE}/cart/${sessionId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Não foi possível esvaziar sua sacola.');
  return res.json();
}

// --- Authenticated user's cart -------------------------------------

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` };
}

export async function fetchMyCart(token) {
  const res = await apiFetch(`${API_BASE}/cart/me`, { headers: authHeaders(token) });
  if (!res.ok) throw new Error('Não foi possível carregar sua sacola.');
  return res.json();
}

export async function addItemToMyCart(token, productId, quantity = 1) {
  const res = await apiFetch(`${API_BASE}/cart/me/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify({ product_id: productId, quantity }),
  });
  if (!res.ok) throw new Error('Não foi possível adicionar o produto à sacola.');
  return res.json();
}

export async function updateMyItemQuantity(token, itemId, quantity) {
  const res = await apiFetch(`${API_BASE}/cart/me/item/${itemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify({ quantity }),
  });
  if (!res.ok) throw new Error('Não foi possível atualizar a quantidade.');
  return res.json();
}

export async function removeMyItemFromCart(token, itemId) {
  const res = await apiFetch(`${API_BASE}/cart/me/item/${itemId}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error('Não foi possível remover o item.');
  return res.json();
}

export async function clearMyCartApi(token) {
  const res = await apiFetch(`${API_BASE}/cart/me`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error('Não foi possível esvaziar sua sacola.');
  return res.json();
}