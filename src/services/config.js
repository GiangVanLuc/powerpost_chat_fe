export const USE_MOCK = String(import.meta.env.VITE_USE_MOCK ?? 'true') !== 'false';
export const API_URL = import.meta.env.VITE_API_URL || '/api';

function wsUrl() {
  const raw = import.meta.env.VITE_WS_URL || '/ws';
  if (/^wss?:\/\//.test(raw)) return raw;
  const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${proto}//${window.location.host}${raw}`;
}
export const WS_URL = wsUrl();

export const ICE_SERVERS = (() => {
  const servers = [{ urls: 'stun:stun.l.google.com:19302' }];
  const turn = (import.meta.env.VITE_TURN_URLS || '').split(',').map((s) => s.trim()).filter(Boolean);
  if (turn.length) {
    servers.push({ urls: turn, username: import.meta.env.VITE_TURN_USERNAME, credential: import.meta.env.VITE_TURN_CREDENTIAL });
  }
  return servers;
})();

/** Call ring timeout before it becomes a missed call (seconds). */
export const RING_TIMEOUT_SEC = 30;
/** Max message length — keep in sync with the backend validation. */
export const MESSAGE_MAX_LENGTH = 2000;
