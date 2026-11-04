const pad = (n) => String(n).padStart(2, '0');
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function startOfDay(d) { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; }
function dayDiff(iso) { return Math.round((startOfDay(new Date()) - startOfDay(new Date(iso))) / 86400000); }

/** List timestamp: HH:mm today, "Yesterday", weekday this week, dd/MM after. */
export function listTime(iso) {
  if (!iso) return '';
  const d = new Date(iso), diff = dayDiff(iso);
  if (diff === 0) return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  if (diff === 1) return 'Yesterday';
  if (diff < 7) return DAYS[d.getDay()];
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;
}
export function clock(iso) { const d = new Date(iso); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; }

/** Date separator label: Today / Yesterday / Monday, 12 Oct. */
export function dayLabel(iso) {
  const diff = dayDiff(iso), d = new Date(iso);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' });
}
export function sameDay(a, b) { return dayDiff(a) === dayDiff(b); }

export function ago(iso) {
  if (!iso) return '';
  const s = Math.max(0, (Date.now() - new Date(iso)) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} hour${s >= 7200 ? 's' : ''} ago`;
  if (s < 172800) return 'yesterday';
  return `${Math.floor(s / 86400)} days ago`;
}

export function duration(sec) { sec = Math.max(0, Math.floor(sec || 0)); return `${Math.floor(sec / 60)}:${pad(sec % 60)}`; }
export function timer(sec) { sec = Math.max(0, Math.floor(sec || 0)); return `${pad(Math.floor(sec / 60))}:${pad(sec % 60)}`; }

/** Group consecutive messages of one sender within 5 minutes → bubble position. */
export function withPositions(list) {
  return list.map((m, i) => {
    const prev = list[i - 1], next = list[i + 1];
    const near = (a, b) => a && b && a.from === b.from && sameDay(a.createdAt, b.createdAt) && Math.abs(new Date(a.createdAt) - new Date(b.createdAt)) < 5 * 60000;
    const sp = near(prev, m), sn = near(m, next);
    return { ...m, position: sp && sn ? 'middle' : sp ? 'last' : sn ? 'first' : 'single' };
  });
}
