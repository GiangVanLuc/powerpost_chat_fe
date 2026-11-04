import { API_URL, USE_MOCK } from './config.js';
import * as mock from '../mocks/mockApi.js';
import { ApiError } from './errors.js';

/**
 * REST client for the Spring Boot backend.
 * Every function has the same signature in mock mode (src/mocks/mockApi.js),
 * so pages never need to know which one is running.
 *
 * Expected endpoints (adjust to your controllers):
 *   POST /auth/login            { usernameOrEmail, password } -> { token, user }
 *   POST /auth/register         { displayName, username, email, password } -> { token, user }
 *   GET  /users/me              -> user
 *   PUT  /users/me              { displayName, bio, avatarUrl } -> user
 *   GET  /users/search?q=       -> [{ ...user, relationship: none|pending|incoming|friends }]
 *   GET  /friends               -> [user + presence]
 *   GET  /friends/requests      -> { incoming: [...], outgoing: [...] }
 *   POST /friends/requests      { username }
 *   POST /friends/requests/{id}/accept | /reject
 *   DELETE /friends/{username}
 *   GET  /conversations         -> [{ peer, lastMessage, unread }]
 *   GET  /conversations/{username}/messages?before=&limit=
 *   GET  /calls                 -> call history
 *   GET  /notifications         -> notifications ; POST /notifications/read-all
 */

let token = (() => { try { return localStorage.getItem('pp_token'); } catch (e) { return null; } })();

export function setToken(t) {
  token = t;
  try { t ? localStorage.setItem('pp_token', t) : localStorage.removeItem('pp_token'); } catch (e) { /* storage blocked */ }
}
export function getToken() { return token; }

export { ApiError };

async function request(method, path, body) {
  let res;
  try {
    res = await fetch(API_URL + path, {
      method,
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: body ? JSON.stringify(body) : undefined
    });
  } catch (e) {
    throw new ApiError("Can't reach the server", 0);
  }
  const data = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) throw new ApiError((data && data.message) || 'Something went wrong', res.status, data && data.field);
  return data;
}

const real = {
  login: (usernameOrEmail, password) => request('POST', '/auth/login', { usernameOrEmail, password }),
  register: (form) => request('POST', '/auth/register', form),
  me: () => request('GET', '/users/me'),
  updateProfile: (patch) => request('PUT', '/users/me', patch),
  searchUsers: (q) => request('GET', `/users/search?q=${encodeURIComponent(q)}`),
  friends: () => request('GET', '/friends'),
  friendRequests: () => request('GET', '/friends/requests'),
  sendFriendRequest: (username) => request('POST', '/friends/requests', { username }),
  acceptRequest: (id) => request('POST', `/friends/requests/${id}/accept`),
  rejectRequest: (id) => request('POST', `/friends/requests/${id}/reject`),
  unfriend: (username) => request('DELETE', `/friends/${username}`),
  conversations: () => request('GET', '/conversations'),
  messages: (username, before) => request('GET', `/conversations/${username}/messages?limit=50${before ? `&before=${before}` : ''}`),
  calls: () => request('GET', '/calls'),
  notifications: () => request('GET', '/notifications'),
  markAllRead: () => request('POST', '/notifications/read-all')
};

export const api = USE_MOCK ? mock : real;
