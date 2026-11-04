import { USE_MOCK, WS_URL } from './config.js';
import { mockSocket } from '../mocks/mockSocket.js';

/**
 * Realtime channel (chat, presence, call signaling) over a plain WebSocket with JSON frames:
 *   { "type": "message.new", "data": { ... } }
 *
 * Server → client types used by the UI:
 *   message.new, message.status (sent|delivered|read), presence (online|offline|in-call),
 *   friend.request, friend.accepted, notification,
 *   call.incoming, call.accepted, call.rejected, call.ended, call.missed, call.busy,
 *   rtc.offer, rtc.answer, rtc.ice
 * Client → server types:
 *   message.send { to, text, clientId }, message.read { peer },
 *   call.invite { to, media }, call.accept { callId }, call.reject { callId }, call.end { callId },
 *   rtc.offer / rtc.answer / rtc.ice { callId, to, payload }
 *
 * If your Spring Boot side uses STOMP, keep this interface and swap the transport
 * (e.g. @stomp/stompjs) inside connect()/send().
 */
class RealtimeSocket {
  constructor() {
    this.ws = null;
    this.handlers = new Map();
    this.status = 'offline';
    this.retry = 0;
    this.timer = null;
    this.queue = [];
    this.token = null;
  }

  on(type, fn) {
    if (!this.handlers.has(type)) this.handlers.set(type, new Set());
    this.handlers.get(type).add(fn);
    return () => this.handlers.get(type).delete(fn);
  }

  emit(type, data) {
    (this.handlers.get(type) || []).forEach((fn) => fn(data));
    (this.handlers.get('*') || []).forEach((fn) => fn({ type, data }));
  }

  setStatus(s) { if (this.status !== s) { this.status = s; this.emit('status', s); } }

  connect(token) {
    this.token = token;
    clearTimeout(this.timer);
    this.setStatus(this.retry ? 'reconnecting' : 'connecting');
    const ws = new WebSocket(`${WS_URL}?token=${encodeURIComponent(token || '')}`);
    this.ws = ws;
    ws.onopen = () => {
      this.retry = 0;
      this.setStatus('online');
      this.queue.splice(0).forEach((f) => ws.send(f));
    };
    ws.onmessage = (e) => {
      try { const { type, data } = JSON.parse(e.data); this.emit(type, data); } catch (err) { /* ignore malformed frame */ }
    };
    ws.onclose = () => {
      if (this.ws !== ws) return;
      this.retry += 1;
      this.setStatus(this.retry > 6 ? 'offline' : 'reconnecting');
      const delay = Math.min(1000 * 2 ** (this.retry - 1), 15000); // 1s, 2s, 4s… max 15s
      this.timer = setTimeout(() => this.connect(this.token), delay);
    };
  }

  retryNow() { this.retry = 1; this.connect(this.token); }

  send(type, data) {
    const frame = JSON.stringify({ type, data });
    if (this.ws && this.ws.readyState === WebSocket.OPEN) this.ws.send(frame);
    else this.queue.push(frame);
  }

  disconnect() {
    clearTimeout(this.timer);
    const ws = this.ws; this.ws = null;
    if (ws) ws.close();
    this.retry = 0;
    this.setStatus('offline');
  }
}

export const socket = USE_MOCK ? mockSocket : new RealtimeSocket();
