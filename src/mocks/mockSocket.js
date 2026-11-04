import { mockDb } from './mockApi.js';

/**
 * Fake realtime server for mock mode. Same interface as RealtimeSocket (on / send / connect…).
 * Also exposes demo helpers used by the Demo panel: incoming call, missed call, connection drop.
 */
const replies = ['Ok nhé 👍', 'Để mình xem rồi báo lại', 'Chuẩn luôn', 'Tối nay 8h nhé?', 'Mình đang test lại phần signaling'];

class MockSocket {
  constructor() { this.handlers = new Map(); this.status = 'offline'; this.timers = []; this.call = null; }
  on(type, fn) {
    if (!this.handlers.has(type)) this.handlers.set(type, new Set());
    this.handlers.get(type).add(fn);
    return () => this.handlers.get(type).delete(fn);
  }
  emit(type, data) { (this.handlers.get(type) || []).forEach((fn) => fn(data)); }
  later(ms, fn) { const t = setTimeout(fn, ms); this.timers.push(t); return t; }
  setStatus(s) { if (this.status !== s) { this.status = s; this.emit('status', s); } }

  connect() { this.setStatus('connecting'); this.later(300, () => this.setStatus('online')); }
  disconnect() { this.timers.forEach(clearTimeout); this.timers = []; this.setStatus('offline'); }
  retryNow() { this.setStatus('reconnecting'); this.later(800, () => this.setStatus('online')); }

  send(type, data) {
    if (type === 'message.send') this.handleMessage(data);
    else if (type === 'message.read') { /* nothing to echo in mock */ }
    else if (type === 'call.invite') this.handleInvite(data);
    else if (type === 'call.accept') { if (this.call) this.later(900, () => this.emit('call.connected', { callId: this.call.id })); }
    else if (type === 'call.reject' || type === 'call.end') { clearTimeout(this.missT); this.call = null; }
  }

  handleMessage({ to, text, clientId }) {
    const id = 'm' + Date.now();
    const msg = { id, clientId, peer: to, from: mockDb.me.username, text, createdAt: new Date().toISOString(), status: 'sent' };
    if (!mockDb.messages[to]) mockDb.messages[to] = [];
    mockDb.messages[to].push(msg);
    const online = this.status === 'online';
    this.later(400, () => this.emit('message.status', { clientId, id, peer: to, status: online ? 'sent' : 'failed' }));
    if (!online) return;
    const peer = mockDb.users[to];
    if (peer && peer.presence !== 'offline') {
      this.later(1100, () => this.emit('message.status', { clientId, id, peer: to, status: 'delivered' }));
      this.later(2400, () => this.emit('message.status', { clientId, id, peer: to, status: 'read' }));
      if (Math.random() < 0.6) {
        this.later(3600, () => {
          const reply = { id: 'm' + Date.now(), peer: to, from: to, text: replies[Math.floor(Math.random() * replies.length)], createdAt: new Date().toISOString() };
          mockDb.messages[to].push(reply);
          this.emit('message.new', reply);
        });
      }
    }
  }

  handleInvite({ to, media }) {
    const id = 'call' + Date.now();
    this.call = { id, peer: to, media };
    this.emit('call.created', { callId: id, peer: to, media });
    const peer = mockDb.users[to];
    if (peer && peer.presence === 'in-call') { this.later(800, () => this.emit('call.busy', { callId: id })); return; }
    this.later(1200, () => this.emit('call.ringing', { callId: id }));
    if (peer && peer.presence === 'offline') { this.later(6000, () => this.emit('call.missed', { callId: id })); return; }
    this.later(3800, () => { if (this.call && this.call.id === id) this.emit('call.accepted', { callId: id }); });
    this.later(4800, () => { if (this.call && this.call.id === id) this.emit('call.connected', { callId: id }); });
  }

  // ---- demo helpers ----
  simulateIncomingCall(peer = 'minhanh', media = 'video', willMiss = false) {
    const id = 'call' + Date.now();
    this.call = { id, peer, media };
    this.emit('call.incoming', { callId: id, from: peer, media });
    if (willMiss) this.missT = this.later(6000, () => { if (this.call && this.call.id === id) { this.call = null; this.emit('call.missed', { callId: id, from: peer, media }); } });
  }
  simulateDrop(ms = 4000) {
    this.setStatus('reconnecting');
    this.later(ms, () => this.setStatus('online'));
  }
  simulateFriendAccept(username) {
    this.later(2200, () => this.emit('friend.accepted', { username }));
  }
}

export const mockSocket = new MockSocket();
