import { ME, USERS, FRIENDS, REQUESTS, MESSAGES, UNREAD, CALLS, NOTIFICATIONS } from './data.js';
import { ApiError } from '../services/errors.js';

// In-memory backend used when VITE_USE_MOCK=true. Same shapes as the real REST API.
const db = {
  me: { ...ME },
  users: JSON.parse(JSON.stringify(USERS)),
  friends: [...FRIENDS],
  requests: JSON.parse(JSON.stringify(REQUESTS)),
  messages: JSON.parse(JSON.stringify(MESSAGES)),
  unread: { ...UNREAD },
  calls: JSON.parse(JSON.stringify(CALLS)),
  notifications: JSON.parse(JSON.stringify(NOTIFICATIONS))
};
export { db as mockDb };

const wait = (ms = 350) => new Promise((r) => setTimeout(r, ms));
const pub = (u) => ({ id: u.id, username: u.username, displayName: u.displayName, bio: u.bio, presence: u.presence, lastSeen: u.lastSeen, avatarUrl: u.avatarUrl || '' });

export async function login(usernameOrEmail, password) {
  await wait(700);
  if (password === 'sai' || !password) throw new ApiError('Incorrect username or password.', 401);
  return { token: 'mock-token', user: { ...db.me } };
}

export async function register(form) {
  await wait(800);
  if (db.users[form.username] || form.username === db.me.username) throw new ApiError('Username is already taken.', 409, 'username');
  if (form.email === db.me.email) throw new ApiError('An account with this email already exists.', 409, 'email');
  db.me = { ...db.me, displayName: form.displayName, username: form.username, email: form.email, bio: '' };
  return { token: 'mock-token', user: { ...db.me } };
}

export async function me() { await wait(150); return { ...db.me }; }
export async function updateProfile(patch) { await wait(700); db.me = { ...db.me, ...patch }; return { ...db.me }; }

export async function searchUsers(q) {
  await wait(450);
  const norm = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase();
  const nq = norm(q.replace(/^@/, ''));
  return Object.values(db.users).filter((u) => norm(u.displayName + ' ' + u.username).includes(nq)).map((u) => {
    let relationship = 'none';
    if (db.friends.includes(u.username)) relationship = 'friends';
    else if (db.requests.outgoing.some((r) => r.user === u.username)) relationship = 'pending';
    else if (db.requests.incoming.some((r) => r.user === u.username)) relationship = 'incoming';
    return { ...pub(u), relationship };
  });
}

export async function friends() { await wait(400); return db.friends.map((n) => pub(db.users[n])); }
export async function friendRequests() {
  await wait(300);
  return {
    incoming: db.requests.incoming.map((r) => ({ id: r.id, createdAt: r.createdAt, user: pub(db.users[r.user]) })),
    outgoing: db.requests.outgoing.map((r) => ({ id: r.id, createdAt: r.createdAt, user: pub(db.users[r.user]) }))
  };
}
export async function sendFriendRequest(username) {
  await wait(500);
  const r = { id: 'r' + Date.now(), user: username, createdAt: new Date().toISOString() };
  db.requests.outgoing.push(r);
  return r;
}
export async function acceptRequest(id) {
  await wait(400);
  const r = db.requests.incoming.find((x) => x.id === id);
  db.requests.incoming = db.requests.incoming.filter((x) => x.id !== id);
  if (r && !db.friends.includes(r.user)) db.friends.push(r.user);
  return r && pub(db.users[r.user]);
}
export async function rejectRequest(id) { await wait(300); db.requests.incoming = db.requests.incoming.filter((x) => x.id !== id); return null; }
export async function unfriend(username) { await wait(400); db.friends = db.friends.filter((n) => n !== username); return null; }

export async function conversations() {
  await wait(500);
  return Object.keys(db.messages).map((peer) => {
    const list = db.messages[peer];
    return { peer: pub(db.users[peer]), lastMessage: list[list.length - 1] || null, unread: db.unread[peer] || 0 };
  }).sort((a, b) => (b.lastMessage?.createdAt || '').localeCompare(a.lastMessage?.createdAt || ''));
}
export async function messages(username) { await wait(400); db.unread[username] = 0; return [...(db.messages[username] || [])]; }

export async function calls() { await wait(400); return [...db.calls]; }
export async function notifications() { await wait(250); return [...db.notifications]; }
export async function markAllRead() { await wait(150); db.notifications.forEach((n) => { n.read = true; }); return null; }
