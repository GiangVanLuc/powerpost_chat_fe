import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { api, setToken, getToken } from '../services/api.js';
import { socket } from '../services/socket.js';
import { getMedia, PeerCall, stopStream } from '../services/webrtc.js';
import { USE_MOCK, RING_TIMEOUT_SEC } from '../services/config.js';

/**
 * App-wide state: session, realtime connection, friends, conversations, calls, notifications, toasts.
 * Pages read with useApp() and call the actions below. All server traffic goes through
 * services/api.js (REST) and services/socket.js (WebSocket); calls through services/webrtc.js.
 */
const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

const initial = {
  booting: true,
  user: null,
  connection: 'offline',          // online | connecting | reconnecting | offline
  showRestored: false,
  users: {},                      // username -> public user (presence, lastSeen…)
  friends: [],                    // usernames
  requests: { incoming: [], outgoing: [] },
  convOrder: [],                  // usernames, most recent first
  conversations: {},              // username -> { messages, loaded, loading, unread }
  calls: [],
  notifications: [],
  call: null,                     // active call (see startCall)
  permission: null,               // { case, media, peer } when getUserMedia fails
  toasts: []
};

let seq = 0;
const uid = (p) => `${p}${Date.now().toString(36)}${(seq++).toString(36)}`;

export function AppProvider({ children }) {
  const [state, setState] = useState(initial);
  const ref = useRef(state);
  ref.current = state;
  const set = useCallback((fn) => setState((s) => ({ ...s, ...(typeof fn === 'function' ? fn(s) : fn) })), []);
  const media = useRef({ local: null, peer: null, tick: null, ring: null });

  // ---------- toasts ----------
  const toast = useCallback((tone, title, message) => {
    const id = uid('t');
    set((s) => ({ toasts: [...s.toasts.slice(-2), { id, tone, title, message }] }));
    if (tone !== 'error') setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 4000);
  }, [set]);
  const dismissToast = useCallback((id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), [set]);

  // ---------- data loading ----------
  const mergeUsers = (list) => (s) => { const users = { ...s.users }; list.forEach((u) => { users[u.username] = { ...users[u.username], ...u }; }); return { users }; };

  const loadAll = useCallback(async () => {
    const [friends, requests, convs, calls, notifications] = await Promise.all([
      api.friends(), api.friendRequests(), api.conversations(), api.calls(), api.notifications()
    ]);
    set((s) => {
      const users = mergeUsers([...friends, ...requests.incoming.map((r) => r.user), ...requests.outgoing.map((r) => r.user), ...convs.map((c) => c.peer)])(s).users;
      const conversations = { ...s.conversations };
      convs.forEach((c) => { conversations[c.peer.username] = { ...(conversations[c.peer.username] || { messages: [], loaded: false }), preview: c.lastMessage, unread: c.unread }; });
      return {
        users, friends: friends.map((f) => f.username),
        requests: { incoming: requests.incoming.map((r) => ({ id: r.id, createdAt: r.createdAt, username: r.user.username })), outgoing: requests.outgoing.map((r) => ({ id: r.id, createdAt: r.createdAt, username: r.user.username })) },
        convOrder: convs.map((c) => c.peer.username), conversations, calls, notifications
      };
    });
  }, [set]);

  const startSession = useCallback(async (user, token) => {
    setToken(token);
    set({ user, booting: false });
    socket.connect(token);
    try { await loadAll(); } catch (e) { toast('error', "Couldn't load your data", e.message); }
  }, [set, loadAll, toast]);

  // restore session on reload
  useEffect(() => {
    const token = getToken();
    if (!token) { set({ booting: false }); return; }
    api.me().then((u) => startSession(u, token)).catch(() => { setToken(null); set({ booting: false }); });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ---------- auth ----------
  const login = useCallback(async (usernameOrEmail, password) => {
    const { token, user } = await api.login(usernameOrEmail, password);
    await startSession(user, token);
  }, [startSession]);
  const register = useCallback(async (form) => {
    const { token, user } = await api.register(form);
    await startSession(user, token);
  }, [startSession]);
  const logout = useCallback(() => { socket.disconnect(); setToken(null); setState({ ...initial, booting: false }); }, []);
  const updateProfile = useCallback(async (patch) => { const user = await api.updateProfile(patch); set({ user }); toast('success', 'Profile updated'); }, [set, toast]);

  // ---------- conversations ----------
  const openConversation = useCallback(async (username) => {
    const c = ref.current.conversations[username];
    set((s) => ({ conversations: { ...s.conversations, [username]: { ...(s.conversations[username] || { messages: [] }), unread: 0, loading: !(c && c.loaded) } } }));
    socket.send('message.read', { peer: username });
    if (c && c.loaded) return;
    try {
      const messages = await api.messages(username);
      set((s) => ({ conversations: { ...s.conversations, [username]: { ...s.conversations[username], messages, loaded: true, loading: false, unread: 0 } } }));
    } catch (e) {
      set((s) => ({ conversations: { ...s.conversations, [username]: { ...s.conversations[username], loading: false, error: true } } }));
    }
  }, [set]);

  const pushMessage = (peer, msg) => (s) => {
    const c = s.conversations[peer] || { messages: [], loaded: true };
    return {
      conversations: { ...s.conversations, [peer]: { ...c, messages: [...c.messages, msg], preview: msg } },
      convOrder: [peer, ...s.convOrder.filter((n) => n !== peer)]
    };
  };

  const sendMessage = useCallback((peer, text) => {
    const clientId = uid('c');
    const msg = { id: clientId, clientId, peer, from: ref.current.user.username, text, createdAt: new Date().toISOString(), status: 'sending' };
    set(pushMessage(peer, msg));
    socket.send('message.send', { to: peer, text, clientId });
  }, [set]);

  const retryMessage = useCallback((peer, clientId) => {
    const c = ref.current.conversations[peer];
    const m = c && c.messages.find((x) => x.clientId === clientId);
    if (!m) return;
    set((s) => ({ conversations: { ...s.conversations, [peer]: { ...c, messages: c.messages.filter((x) => x.clientId !== clientId) } } }));
    sendMessage(peer, m.text);
  }, [set, sendMessage]);

  // ---------- friends ----------
  const searchUsers = useCallback(async (q) => { const list = await api.searchUsers(q); set(mergeUsers(list.map(({ relationship, ...u }) => u))); return list; }, [set]);
  const sendFriendRequest = useCallback(async (username) => {
    const r = await api.sendFriendRequest(username);
    set((s) => ({ requests: { ...s.requests, outgoing: [...s.requests.outgoing, { id: r.id, createdAt: r.createdAt, username }] } }));
    toast('info', 'Friend request sent');
    if (USE_MOCK && username === 'halinh') socket.simulateFriendAccept(username);
  }, [set, toast]);
  const acceptRequest = useCallback(async (id) => {
    const r = ref.current.requests.incoming.find((x) => x.id === id);
    await api.acceptRequest(id);
    set((s) => ({
      friends: r ? [...s.friends, r.username] : s.friends,
      requests: { ...s.requests, incoming: s.requests.incoming.filter((x) => x.id !== id) },
      notifications: s.notifications.map((n) => (n.requestId === id ? { ...n, type: 'request-accepted', text: 'is now your friend', read: true } : n))
    }));
    if (r) toast('success', `You and ${ref.current.users[r.username]?.displayName || r.username} are now friends`);
  }, [set, toast]);
  const rejectRequest = useCallback(async (id) => {
    await api.rejectRequest(id);
    set((s) => ({ requests: { ...s.requests, incoming: s.requests.incoming.filter((x) => x.id !== id) }, notifications: s.notifications.filter((n) => n.requestId !== id) }));
  }, [set]);
  const unfriend = useCallback(async (username) => {
    await api.unfriend(username);
    set((s) => ({ friends: s.friends.filter((n) => n !== username) }));
    toast('info', 'Removed from friends');
  }, [set, toast]);

  // ---------- notifications ----------
  const markAllRead = useCallback(async () => { set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })); await api.markAllRead(); }, [set]);
  const markRead = useCallback((id) => set((s) => ({ notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) })), [set]);
  const notify = (n) => (s) => ({ notifications: [{ id: uid('n'), createdAt: new Date().toISOString(), read: false, ...n }, ...s.notifications] });

  // ---------- calls ----------
  const patchCall = useCallback((p) => set((s) => (s.call ? { call: { ...s.call, ...p } } : {})), [set]);

  const cleanupMedia = () => {
    clearInterval(media.current.tick); clearTimeout(media.current.ring);
    if (media.current.peer) media.current.peer.close();
    stopStream(media.current.local);
    media.current = { local: null, peer: null, tick: null, ring: null };
  };

  const logCall = (call, status) => set((s) => ({
    calls: [{ id: call.id || uid('c'), peer: call.peer, direction: call.direction, media: call.media, status, startedAt: call.startedAt || new Date().toISOString(), duration: status === 'completed' ? call.secs : undefined }, ...s.calls]
  }));

  const finishCall = useCallback((status, summaryPhase = 'ended') => {
    const call = ref.current.call; if (!call) return;
    if (call.direction === 'outgoing' || status !== 'missed') logCall(call, status);
    cleanupMedia();
    patchCall({ phase: summaryPhase, localStream: null, remoteStream: null });
    setTimeout(() => set((s) => (s.call && s.call.id === call.id ? { call: null } : {})), 2000);
  }, [patchCall, set]); // eslint-disable-line react-hooks/exhaustive-deps

  const beginConnected = useCallback(() => {
    patchCall({ phase: 'connected', connectedAt: Date.now() });
    clearInterval(media.current.tick);
    media.current.tick = setInterval(() => set((s) => (s.call && s.call.phase !== 'ended' ? { call: { ...s.call, secs: (s.call.secs || 0) + 1 } } : {})), 1000);
  }, [patchCall, set]);

  const acquire = async (callMedia, peer) => {
    patchCall({ phase: 'permission' });
    const { stream, error } = await getMedia(callMedia);
    if (error) { set({ permission: { case: error, media: callMedia, peer } }); return null; }
    media.current.local = stream;
    patchCall({ localStream: stream, camOn: callMedia === 'video' });
    return stream;
  };

  const startCall = useCallback(async (peer, callMedia, opts = {}) => {
    if (ref.current.call) return;
    if (ref.current.connection !== 'online') { toast('error', "You're offline", 'Calls are available when the connection is back.'); return; }
    const call = { id: null, peer, media: callMedia, direction: 'outgoing', phase: 'calling', micOn: true, camOn: callMedia === 'video', secs: 0, startedAt: new Date().toISOString() };
    set({ call, permission: null });
    let stream = null;
    if (!opts.skipMedia) { stream = await acquire(callMedia, peer); if (!stream) return; }
    patchCall({ phase: 'calling' });
    socket.send('call.invite', { to: peer, media: callMedia });
    if (!USE_MOCK && stream) {
      media.current.pendingStream = stream;
    }
  }, [set, patchCall, toast]); // eslint-disable-line react-hooks/exhaustive-deps

  const continueAudioOnly = useCallback(async () => {
    const p = ref.current.permission; if (!p) return;
    set({ permission: null, call: null });
    await startCall(p.peer, 'voice');
  }, [set, startCall]);
  const retryPermission = useCallback(async () => {
    const p = ref.current.permission; if (!p) return;
    set({ permission: null, call: null });
    await startCall(p.peer, p.media);
  }, [set, startCall]);
  const cancelPermission = useCallback(() => { cleanupMedia(); set({ permission: null, call: null }); }, [set]); // eslint-disable-line react-hooks/exhaustive-deps

  const acceptCall = useCallback(async () => {
    const call = ref.current.call; if (!call) return;
    clearTimeout(media.current.ring);
    const stream = await acquire(call.media, call.peer);
    if (!stream) { socket.send('call.reject', { callId: call.id }); return; }
    patchCall({ phase: 'connecting' });
    socket.send('call.accept', { callId: call.id });
    if (!USE_MOCK) media.current.peer = new PeerCall({ callId: call.id, peer: call.peer, localStream: stream, onRemoteStream: (rs) => patchCall({ remoteStream: rs }), onStateChange: onPeerState });
  }, [patchCall]); // eslint-disable-line react-hooks/exhaustive-deps

  const rejectCall = useCallback(() => {
    const call = ref.current.call; if (!call) return;
    socket.send('call.reject', { callId: call.id });
    logCall(call, 'rejected');
    cleanupMedia();
    set({ call: null });
  }, [set]); // eslint-disable-line react-hooks/exhaustive-deps

  const endCall = useCallback(() => {
    const call = ref.current.call; if (!call) return;
    socket.send('call.end', { callId: call.id });
    finishCall(call.phase === 'connected' ? 'completed' : 'cancelled');
  }, [finishCall]);

  const toggleMic = useCallback(() => {
    const call = ref.current.call; if (!call) return;
    const on = !call.micOn;
    if (media.current.local) media.current.local.getAudioTracks().forEach((t) => { t.enabled = on; });
    patchCall({ micOn: on });
  }, [patchCall]);
  const toggleCam = useCallback(() => {
    const call = ref.current.call; if (!call) return;
    const on = !call.camOn;
    if (media.current.local) media.current.local.getVideoTracks().forEach((t) => { t.enabled = on; });
    patchCall({ camOn: on });
  }, [patchCall]);

  function onPeerState(st) {
    if (st === 'connected') beginConnected();
    else if (st === 'disconnected') patchCall({ phase: 'reconnecting' });
    else if (st === 'failed') finishCall('failed', 'failed');
  }

  // ---------- socket events ----------
  useEffect(() => {
    const offs = [
      socket.on('status', (st) => {
        const prev = ref.current.connection;
        set({ connection: st });
        if (st === 'online' && (prev === 'reconnecting' || prev === 'offline') && ref.current.user) {
          set({ showRestored: true });
          toast('info', 'Back online', 'Messages are synced.');
          setTimeout(() => set({ showRestored: false }), 2000);
        }
      }),
      socket.on('message.status', ({ clientId, id, peer, status }) => set((s) => {
        const c = s.conversations[peer]; if (!c) return {};
        const messages = c.messages.map((m) => (m.clientId === clientId ? { ...m, id: id || m.id, status } : m));
        return { conversations: { ...s.conversations, [peer]: { ...c, messages, preview: messages[messages.length - 1] } } };
      })),
      socket.on('message.new', (msg) => {
        const peer = msg.from;
        set((s) => {
          const r = pushMessage(peer, msg)(s);
          const active = window.location.pathname === `/chats/${peer}`;
          r.conversations[peer].unread = active ? 0 : (s.conversations[peer]?.unread || 0) + 1;
          return r;
        });
      }),
      socket.on('presence', ({ username, presence, lastSeen }) => set((s) => ({ users: { ...s.users, [username]: { ...s.users[username], presence, lastSeen } } }))),
      socket.on('friend.request', ({ id, username, user }) => set((s) => ({
        ...(user ? mergeUsers([user])(s) : {}),
        requests: { ...s.requests, incoming: [...s.requests.incoming, { id, username, createdAt: new Date().toISOString() }] },
        ...notify({ type: 'friend-request', from: username, requestId: id, text: 'sent you a friend request' })(s)
      }))),
      socket.on('friend.accepted', ({ username }) => {
        set((s) => ({
          friends: s.friends.includes(username) ? s.friends : [...s.friends, username],
          requests: { ...s.requests, outgoing: s.requests.outgoing.filter((r) => r.username !== username) },
          ...notify({ type: 'request-accepted', from: username, text: 'accepted your friend request' })(s)
        }));
        toast('success', `${ref.current.users[username]?.displayName || username} accepted your friend request`, 'You can message and call each other now.');
      }),
      // ---- calls ----
      socket.on('call.created', ({ callId }) => patchCall({ id: callId })),
      socket.on('call.ringing', () => patchCall({ phase: 'ringing' })),
      socket.on('call.busy', () => { toast('info', 'Busy', 'They are in another call.'); finishCall('missed', 'failed'); }),
      socket.on('call.accepted', async () => {
        patchCall({ phase: 'connecting' });
        if (!USE_MOCK) {
          const call = ref.current.call;
          media.current.peer = new PeerCall({ callId: call.id, peer: call.peer, localStream: media.current.local, onRemoteStream: (rs) => patchCall({ remoteStream: rs }), onStateChange: onPeerState });
          await media.current.peer.call();
        }
      }),
      socket.on('call.connected', () => beginConnected()),
      socket.on('call.rejected', () => { toast('info', 'Call declined'); finishCall('rejected', 'ended'); }),
      socket.on('call.ended', () => finishCall('completed')),
      socket.on('call.incoming', ({ callId, from, media: m, user }) => {
        if (user) set(mergeUsers([user]));
        if (ref.current.call) { socket.send('call.reject', { callId, reason: 'busy' }); return; }
        set({ call: { id: callId, peer: from, media: m, direction: 'incoming', phase: 'incoming', micOn: true, camOn: m === 'video', secs: 0, startedAt: new Date().toISOString() } });
        media.current.ring = setTimeout(() => { if (ref.current.call && ref.current.call.phase === 'incoming') socket.emit && socket.emit('call.missed', { callId, from, media: m }); }, RING_TIMEOUT_SEC * 1000);
      }),
      socket.on('call.missed', ({ from, media: m }) => {
        const call = ref.current.call;
        const peer = from || (call && call.peer);
        if (call && call.direction === 'outgoing') { toast('info', 'No answer'); finishCall('missed', 'ended'); return; }
        clearTimeout(media.current.ring);
        set((s) => ({
          call: null,
          calls: [{ id: uid('c'), peer, direction: 'incoming', media: m || (call && call.media), status: 'missed', startedAt: new Date().toISOString() }, ...s.calls],
          ...notify({ type: 'missed-call', from: peer, text: `missed ${m || 'voice'} call` })(s)
        }));
        toast('error', `Missed ${m || 'voice'} call from ${ref.current.users[peer]?.displayName || peer}`);
      })
    ];
    return () => offs.forEach((f) => f());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const value = useMemo(() => ({
    ...state,
    actions: {
      login, register, logout, updateProfile, toast, dismissToast,
      openConversation, sendMessage, retryMessage,
      searchUsers, sendFriendRequest, acceptRequest, rejectRequest, unfriend,
      markAllRead, markRead,
      markCallsSeen: () => set((s) => ({ calls: s.calls.map((c) => (c.seen ? c : { ...c, seen: true })) })),
      startCall, acceptCall, rejectCall, endCall, toggleMic, toggleCam, continueAudioOnly, retryPermission, cancelPermission,
      retryConnection: () => socket.retryNow()
    }
  }), [state]); // eslint-disable-line react-hooks/exhaustive-deps

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
