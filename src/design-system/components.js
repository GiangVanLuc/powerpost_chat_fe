/**
 * PowerPost design system — React components (ES module build).
 * Source of truth: /design-system (tokens.json, components/README.md per component).
 * Written with React.createElement (no JSX) so it can also be shipped as the classic
 * window.PowerPost bundle used by the design-system previews.
 */
import React from 'react';
  var h = React.createElement;
var useState = React.useState, useEffect = React.useEffect, useRef = React.useRef;
function cx() { var o = []; for (var i = 0; i < arguments.length; i++) if (arguments[i]) o.push(arguments[i]); return o.join(' '); }
function rest(p, omit) { var o = {}; for (var k in p) if (omit.indexOf(k) < 0) o[k] = p[k]; return o; }

/* ---------- Icon (Lucide-style outline, 24 grid) ---------- */
var PH = 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z';
var USERS_BASE = [['path', { d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' }], ['circle', { cx: 9, cy: 7, r: 4 }]];
var ICONS = {
  chats: [['path', { d: 'M7.9 20A9 9 0 1 0 4 16.1L2 22Z' }]],
  users: USERS_BASE.concat([['path', { d: 'M22 21v-2a4 4 0 0 0-3-3.87' }], ['path', { d: 'M16 3.13a4 4 0 0 1 0 7.75' }]]),
  'user-plus': USERS_BASE.concat([['path', { d: 'M19 8v6' }], ['path', { d: 'M22 11h-6' }]]),
  'user-x': USERS_BASE.concat([['path', { d: 'm17 8 5 5' }], ['path', { d: 'm22 8-5 5' }]]),
  'user-check': USERS_BASE.concat([['path', { d: 'm16 11 2 2 4-4' }]]),
  user: [['path', { d: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' }], ['circle', { cx: 12, cy: 7, r: 4 }]],
  phone: [['path', { d: PH }]],
  'phone-incoming': [['path', { d: PH }], ['path', { d: 'M16 2v6h6' }], ['path', { d: 'm22 2-6 6' }]],
  'phone-outgoing': [['path', { d: PH }], ['path', { d: 'M22 8V2h-6' }], ['path', { d: 'm16 8 6-6' }]],
  'phone-missed': [['path', { d: PH }], ['path', { d: 'm22 2-6 6' }], ['path', { d: 'm16 2 6 6' }]],
  'phone-off': [['path', { d: 'M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91' }], ['path', { d: 'M22 2 2 22' }]],
  video: [['path', { d: 'm22 8-6 4 6 4V8Z' }], ['rect', { width: 14, height: 12, x: 2, y: 6, rx: 2 }]],
  'video-off': [['path', { d: 'M10.66 6H14a2 2 0 0 1 2 2v2.34l1 1L22 8v8' }], ['path', { d: 'M16 16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2l10 10Z' }], ['path', { d: 'M2 2l20 20' }]],
  mic: [['path', { d: 'M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z' }], ['path', { d: 'M19 10v2a7 7 0 0 1-14 0v-2' }], ['path', { d: 'M12 19v3' }]],
  'mic-off': [['path', { d: 'M2 2l20 20' }], ['path', { d: 'M18.89 13.23A7.12 7.12 0 0 0 19 12v-2' }], ['path', { d: 'M5 10v2a7 7 0 0 0 12 5' }], ['path', { d: 'M15 9.34V5a3 3 0 0 0-5.68-1.33' }], ['path', { d: 'M9 9v3a3 3 0 0 0 5.12 2.12' }], ['path', { d: 'M12 19v3' }]],
  speaker: [['path', { d: 'M11 5 6 9H2v6h4l5 4V5Z' }], ['path', { d: 'M15.54 8.46a5 5 0 0 1 0 7.07' }], ['path', { d: 'M19.07 4.93a10 10 0 0 1 0 14.14' }]],
  bell: [['path', { d: 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9' }], ['path', { d: 'M10.3 21a1.94 1.94 0 0 0 3.4 0' }]],
  settings: [['path', { d: 'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z' }], ['circle', { cx: 12, cy: 12, r: 3 }]],
  search: [['circle', { cx: 11, cy: 11, r: 8 }], ['path', { d: 'm21 21-4.3-4.3' }]],
  plus: [['path', { d: 'M5 12h14' }], ['path', { d: 'M12 5v14' }]],
  more: [['circle', { cx: 12, cy: 12, r: 1 }], ['circle', { cx: 12, cy: 5, r: 1 }], ['circle', { cx: 12, cy: 19, r: 1 }]],
  check: [['path', { d: 'M20 6 9 17l-5-5' }]],
  'check-check': [['path', { d: 'M18 6 7 17l-5-5' }], ['path', { d: 'm22 10-7.5 7.5L13 16' }]],
  clock: [['circle', { cx: 12, cy: 12, r: 10 }], ['path', { d: 'M12 6v6l4 2' }]],
  alert: [['circle', { cx: 12, cy: 12, r: 10 }], ['path', { d: 'M12 8v4' }], ['path', { d: 'M12 16h.01' }]],
  info: [['circle', { cx: 12, cy: 12, r: 10 }], ['path', { d: 'M12 16v-4' }], ['path', { d: 'M12 8h.01' }]],
  'check-circle': [['path', { d: 'M22 11.08V12a10 10 0 1 1-5.93-9.14' }], ['path', { d: 'm9 11 3 3L22 4' }]],
  retry: [['path', { d: 'M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8' }], ['path', { d: 'M21 3v5h-5' }]],
  smile: [['circle', { cx: 12, cy: 12, r: 10 }], ['path', { d: 'M8 14s1.5 2 4 2 4-2 4-2' }], ['path', { d: 'M9 9h.01' }], ['path', { d: 'M15 9h.01' }]],
  send: [['path', { d: 'm22 2-7 20-4-9-9-4Z' }], ['path', { d: 'M22 2 11 13' }]],
  x: [['path', { d: 'M18 6 6 18' }], ['path', { d: 'm6 6 12 12' }]],
  eye: [['path', { d: 'M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z' }], ['circle', { cx: 12, cy: 12, r: 3 }]],
  'eye-off': [['path', { d: 'M9.88 9.88a3 3 0 1 0 4.24 4.24' }], ['path', { d: 'M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68' }], ['path', { d: 'M6.61 6.61A13.53 13.53 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61' }], ['path', { d: 'M2 2l20 20' }]],
  back: [['path', { d: 'm12 19-7-7 7-7' }], ['path', { d: 'M19 12H5' }]],
  'wifi-off': [['path', { d: 'M2 2l20 20' }], ['path', { d: 'M8.5 16.5a5 5 0 0 1 7 0' }], ['path', { d: 'M2 8.82a15 15 0 0 1 4.17-2.65' }], ['path', { d: 'M10.66 5c4.01-.36 8.14.9 11.34 3.76' }], ['path', { d: 'M16.85 11.25a10 10 0 0 1 2.22 1.68' }], ['path', { d: 'M5 13a10 10 0 0 1 5.24-2.76' }], ['path', { d: 'M12 20h.01' }]],
  loader: [['path', { d: 'M21 12a9 9 0 1 1-6.22-8.56' }]],
  'chevron-down': [['path', { d: 'm6 9 6 6 6-6' }]],
  logout: [['path', { d: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' }], ['path', { d: 'm16 17 5-5-5-5' }], ['path', { d: 'M21 12H9' }]],
  inbox: [['path', { d: 'M22 12h-6l-2 3h-4l-2-3H2' }], ['path', { d: 'M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z' }]],
  signal: [['path', { d: 'M2 20h.01' }], ['path', { d: 'M7 20v-4' }], ['path', { d: 'M12 20v-8' }], ['path', { d: 'M17 20V8' }]],
  edit: [['path', { d: 'M12 20h9' }], ['path', { d: 'M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z' }]],
  'server-off': [['rect', { width: 20, height: 8, x: 2, y: 2, rx: 2 }], ['rect', { width: 20, height: 8, x: 2, y: 14, rx: 2 }], ['path', { d: 'M6 6h.01' }], ['path', { d: 'M6 18h.01' }]],
  compass: [['circle', { cx: 12, cy: 12, r: 10 }], ['path', { d: 'm16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36z' }]]
};
function Icon(p) {
  var size = p.size || 20, spec = ICONS[p.name] || ICONS.info;
  return h('svg', { className: cx('rl-icon', p.spin && 'rl-spin', p.className), width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: p.strokeWidth || 1.75, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': p.title ? undefined : true, role: p.title ? 'img' : undefined, 'aria-label': p.title },
    spec.map(function (e, i) { return h(e[0], Object.assign({ key: i }, e[1])); }));
}
Icon.names = Object.keys(ICONS);

/* ---------- AppLogo ---------- */
function AppLogo(p) {
  var s = p.size || 32;
  var mark = h('svg', { className: 'rl-logo-mark', width: s, height: s, viewBox: '0 0 32 32', 'aria-hidden': true },
    h('rect', { className: 'rl-logo-bg', width: 32, height: 32, rx: 9 }),
    h('path', { className: 'rl-logo-fg', d: 'M9 9.5h14a2.5 2.5 0 0 1 2.5 2.5v7a2.5 2.5 0 0 1-2.5 2.5h-7.2L11 25v-3.5H9A2.5 2.5 0 0 1 6.5 19v-7A2.5 2.5 0 0 1 9 9.5Z' }),
    h('path', { className: 'rl-logo-wave', d: 'M11.5 15.5h1.6l1.4-3 2.2 6 1.4-3h2.4' }));
  return h('span', { className: cx('rl-logo', p.className), role: 'img', 'aria-label': p.name || 'PowerPost' }, mark,
    p.wordmark === false ? null : h('span', { className: 'rl-logo-word', style: { fontSize: Math.round(s * 0.62) } }, p.name || 'PowerPost'));
}

/* ---------- Presence + Avatar ---------- */
var PRESENCE_LABEL = { online: 'Online', offline: 'Offline', 'in-call': 'In a call' };
function PresenceDot(p) {
  var st = p.status || 'offline', s = p.size || 10;
  return h('span', { className: cx('rl-presence', 'rl-presence-' + st, p.ring !== false && 'rl-presence-ring', p.className), style: { width: s, height: s }, role: 'status', 'aria-label': PRESENCE_LABEL[st], title: PRESENCE_LABEL[st] });
}
function initials(name) {
  var parts = String(name || '?').trim().split(/\s+/);
  var a = parts[0] ? parts[0][0] : '?', b = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (a + b).toUpperCase();
}
function tint(seed) { var s = String(seed || ''), n = 0; for (var i = 0; i < s.length; i++) n = (n * 31 + s.charCodeAt(i)) >>> 0; return (n % 6) + 1; }
function Avatar(p) {
  var s = p.size || 40, t = p.tone || tint(p.id || p.name);
  var dot = s <= 24 ? 8 : s <= 32 ? 10 : s <= 48 ? 12 : s <= 64 ? 14 : 18;
  return h('span', { className: cx('rl-avatar', p.className), style: { width: s, height: s } },
    p.src ? h('img', { className: 'rl-avatar-img', src: p.src, alt: '' })
      : h('span', { className: 'rl-avatar-initials', style: { background: 'var(--avatar-' + t + '-bg)', color: 'var(--avatar-' + t + '-ink)', fontSize: Math.max(10, Math.round(s * 0.38)) }, 'aria-hidden': true }, initials(p.name)),
    p.presence ? h(PresenceDot, { status: p.presence, size: dot, className: 'rl-avatar-dot' }) : null);
}

/* ---------- Button ---------- */
function Button(p) {
  var v = p.variant || 'primary', size = p.size || 'md', iconOnly = !p.children && p.icon;
  var isz = size === 'sm' ? 16 : size === 'lg' ? 20 : 18;
  var props = rest(p, ['variant', 'size', 'icon', 'iconRight', 'loading', 'fullWidth', 'children', 'className', 'label']);
  return h('button', Object.assign({ type: 'button' }, props, {
    className: cx('rl-btn', 'rl-btn-' + v, 'rl-btn-' + size, iconOnly && 'rl-btn-icon', p.fullWidth && 'rl-btn-full', p.loading && 'rl-btn-loading', p.className),
    disabled: p.disabled || p.loading, 'aria-busy': p.loading || undefined, 'aria-label': iconOnly ? p.label : props['aria-label'], title: iconOnly ? p.label : props.title
  }),
    p.loading ? h(Icon, { name: 'loader', size: isz, spin: true }) : p.icon ? h(Icon, { name: p.icon, size: isz }) : null,
    p.children ? h('span', { className: 'rl-btn-label' }, p.children) : null,
    p.iconRight && !p.loading ? h(Icon, { name: p.iconRight, size: isz }) : null);
}

/* ---------- Fields ---------- */
var uid = 0; function useId(given) { var r = useRef(given || 'rl-f' + (++uid)); return r.current; }
function TextField(p) {
  var id = useId(p.id), hint = p.error || p.help;
  var props = rest(p, ['label', 'help', 'error', 'id', 'trailing', 'leading', 'className', 'counter']);
  return h('div', { className: cx('rl-field', p.error && 'rl-field-error', p.disabled && 'rl-field-disabled', p.className) },
    p.label ? h('label', { className: 'rl-field-label', htmlFor: id }, p.label) : null,
    h('div', { className: 'rl-field-control' },
      p.leading ? h('span', { className: 'rl-field-leading' }, p.leading) : null,
      h('input', Object.assign({ className: 'rl-input', id: id, 'aria-invalid': p.error ? true : undefined, 'aria-describedby': hint ? id + '-hint' : undefined }, props)),
      p.trailing ? h('span', { className: 'rl-field-trailing' }, p.trailing) : null),
    hint ? h('div', { className: cx('rl-field-hint', p.error && 'rl-field-hint-error'), id: id + '-hint' }, p.error ? h(Icon, { name: 'alert', size: 14 }) : null, h('span', null, hint)) : null);
}
function PasswordField(p) {
  var st = useState(!!p.defaultVisible), show = st[0];
  return h(TextField, Object.assign({}, rest(p, ['defaultVisible']), {
    type: show ? 'text' : 'password', autoComplete: p.autoComplete || 'current-password',
    trailing: h('button', { type: 'button', className: 'rl-field-toggle', onClick: function () { st[1](!show); }, 'aria-label': show ? 'Hide password' : 'Show password', title: show ? 'Hide password' : 'Show password' }, h(Icon, { name: show ? 'eye-off' : 'eye', size: 18 }))
  }));
}
function SearchInput(p) {
  var props = rest(p, ['className', 'onClear']);
  return h('div', { className: cx('rl-search', p.className) },
    h(Icon, { name: 'search', size: 16, className: 'rl-search-icon' }),
    h('input', Object.assign({ className: 'rl-search-input', type: 'search', placeholder: 'Search', 'aria-label': p.placeholder || 'Search' }, props)),
    p.value && p.onClear ? h('button', { type: 'button', className: 'rl-search-clear', onClick: p.onClear, 'aria-label': 'Clear search' }, h(Icon, { name: 'x', size: 14 })) : null);
}

/* ---------- Tabs + Badge ---------- */
function Badge(p) {
  var tone = p.tone || 'primary';
  if (p.dot) return h('span', { className: cx('rl-badge-dot', 'rl-badge-' + tone, p.className), 'aria-label': p.label || 'Unread' });
  var n = p.count, max = p.max || 99;
  if (n == null && p.children == null) return null;
  if (n === 0) return null;
  return h('span', { className: cx('rl-badge', 'rl-badge-' + tone, p.className), 'aria-label': n != null ? n + ' unread' : undefined }, n != null ? (n > max ? max + '+' : n) : p.children);
}
function Tabs(p) {
  var items = p.items || [];
  var st = useState(p.value || p.defaultValue || (items[0] && items[0].id)), cur = p.value != null ? p.value : st[0];
  return h('div', { className: cx('rl-tabs', p.className), role: 'tablist' }, items.map(function (it) {
    var on = it.id === cur;
    return h('button', { key: it.id, type: 'button', role: 'tab', 'aria-selected': on, className: cx('rl-tab', on && 'rl-tab-active'), onClick: function () { st[1](it.id); p.onChange && p.onChange(it.id); } },
      h('span', null, it.label), it.count ? h(Badge, { count: it.count, tone: on ? 'primary' : 'neutral' }) : null);
  }));
}

/* ---------- Toast ---------- */
var TOAST_ICON = { success: 'check-circle', error: 'alert', info: 'info' };
function Toast(p) {
  var tone = p.tone || 'info';
  return h('div', { className: cx('rl-toast', 'rl-toast-' + tone, p.className), role: tone === 'error' ? 'alert' : 'status' },
    h(Icon, { name: TOAST_ICON[tone], size: 18, className: 'rl-toast-icon' }),
    h('div', { className: 'rl-toast-body' }, h('div', { className: 'rl-toast-title' }, p.title), p.message ? h('div', { className: 'rl-toast-msg' }, p.message) : null),
    p.action ? h('button', { type: 'button', className: 'rl-toast-action', onClick: p.onAction }, p.action) : null,
    p.onClose ? h('button', { type: 'button', className: 'rl-toast-close', onClick: p.onClose, 'aria-label': 'Dismiss' }, h(Icon, { name: 'x', size: 16 })) : null);
}

/* ---------- Modal ---------- */
function Modal(p) {
  useEffect(function () {
    if (p.open === false || p.inline || !p.onClose) return;
    function k(e) { if (e.key === 'Escape') p.onClose(); }
    window.addEventListener('keydown', k); return function () { window.removeEventListener('keydown', k); };
  }, [p.inline, p.onClose]);
  if (p.open === false) return null;
  var box = h('div', { className: cx('rl-modal', p.tone === 'danger' && 'rl-modal-danger', p.className), role: 'dialog', 'aria-modal': true, 'aria-labelledby': 'rl-modal-t', style: p.width ? { width: p.width } : null },
    h('div', { className: 'rl-modal-head' },
      p.icon ? h('span', { className: cx('rl-modal-icon', 'rl-modal-icon-' + (p.tone || 'primary')) }, h(Icon, { name: p.icon, size: 20 })) : null,
      h('div', { className: 'rl-modal-titles' }, h('h2', { className: 'rl-modal-title', id: 'rl-modal-t' }, p.title), p.description ? h('p', { className: 'rl-modal-desc' }, p.description) : null),
      p.onClose ? h(Button, { variant: 'ghost', size: 'sm', icon: 'x', label: 'Close', onClick: p.onClose, className: 'rl-modal-x' }) : null),
    p.children ? h('div', { className: 'rl-modal-body' }, p.children) : null,
    p.actions ? h('div', { className: 'rl-modal-actions' }, p.actions) : null);
  return h('div', { className: cx('rl-scrim', p.inline && 'rl-scrim-inline'), onMouseDown: function (e) { if (e.target === e.currentTarget && p.onClose) p.onClose(); } }, box);
}

/* ---------- DropdownMenu ---------- */
function DropdownMenu(p) {
  var st = useState(!!p.defaultOpen), open = p.open != null ? p.open : st[0];
  var ref = useRef(null);
  useEffect(function () {
    if (!open) return;
    function d(e) { if (ref.current && !ref.current.contains(e.target)) st[1](false); }
    document.addEventListener('mousedown', d); return function () { document.removeEventListener('mousedown', d); };
  }, [open]);
  var trigger = p.trigger || h(Button, { variant: 'ghost', icon: 'more', label: p.label || 'More options' });
  return h('div', { className: cx('rl-menu-wrap', p.className), ref: ref },
    h('span', { onClick: function () { st[1](!open); } }, trigger),
    open ? h('div', { className: cx('rl-menu', p.align === 'left' ? 'rl-menu-left' : 'rl-menu-right'), role: 'menu' }, (p.items || []).map(function (it, i) {
      if (it.divider) return h('div', { key: i, className: 'rl-menu-divider', role: 'separator' });
      return h('button', { key: i, type: 'button', role: 'menuitem', disabled: it.disabled, className: cx('rl-menu-item', it.danger && 'rl-menu-danger'), onClick: function () { st[1](false); it.onSelect && it.onSelect(); } },
        it.icon ? h(Icon, { name: it.icon, size: 16 }) : null, h('span', null, it.label));
    })) : null);
}

/* ---------- Tooltip ---------- */
function Tooltip(p) {
  return h('span', { className: cx('rl-tip-wrap', p.open && 'rl-tip-open', p.className) }, p.children,
    h('span', { className: cx('rl-tip', 'rl-tip-' + (p.side || 'top')), role: 'tooltip' }, p.label));
}

/* ---------- Skeleton ---------- */
function Skeleton(p) {
  if (p.variant === 'conversation' || p.variant === 'friend') {
    return h('div', { className: 'rl-skel-row', 'aria-hidden': true }, h(Skeleton, { circle: true, width: 48, height: 48 }),
      h('div', { className: 'rl-skel-lines' }, h(Skeleton, { width: '45%', height: 12 }), h(Skeleton, { width: '75%', height: 10 })));
  }
  if (p.variant === 'message') {
    return h('div', { className: cx('rl-skel-msg', p.out && 'rl-skel-msg-out'), 'aria-hidden': true }, h(Skeleton, { width: p.width || 240, height: 38, radius: 'var(--radius-lg)' }));
  }
  return h('span', { className: cx('rl-skel', p.className), 'aria-hidden': true, style: { width: p.width || '100%', height: p.height || 12, borderRadius: p.circle ? 'var(--radius-full)' : (p.radius || 'var(--radius-sm)') } });
}

/* ---------- EmptyState ---------- */
function EmptyState(p) {
  return h('div', { className: cx('rl-empty', p.compact && 'rl-empty-compact', p.className) },
    h('span', { className: cx('rl-empty-icon', p.tone === 'danger' && 'rl-empty-icon-danger') }, h(Icon, { name: p.icon || 'chats', size: p.compact ? 22 : 28 })),
    h('div', { className: 'rl-empty-title' }, p.title),
    p.description ? h('p', { className: 'rl-empty-desc' }, p.description) : null,
    p.action ? h('div', { className: 'rl-empty-action' }, p.action) : null);
}

/* ---------- ConnectionBanner ---------- */
function ConnectionBanner(p) {
  var st = p.state || 'reconnecting';
  var text = p.message || (st === 'offline' ? 'You are offline. Messages will send when you reconnect.' : st === 'restored' ? 'Back online' : 'Connection lost. Reconnecting…');
  return h('div', { className: cx('rl-banner', 'rl-banner-' + st, p.className), role: 'status', 'aria-live': 'polite' },
    st === 'reconnecting' ? h(Icon, { name: 'loader', size: 16, spin: true }) : h(Icon, { name: st === 'restored' ? 'check-circle' : 'wifi-off', size: 16 }),
    h('span', null, text),
    p.onRetry && st !== 'restored' ? h('button', { type: 'button', className: 'rl-banner-action', onClick: p.onRetry }, 'Retry now') : null);
}

/* ---------- NavRail ---------- */
var NAV = [{ id: 'chats', icon: 'chats', label: 'Chats' }, { id: 'friends', icon: 'users', label: 'Friends' }, { id: 'calls', icon: 'phone', label: 'Calls' }, { id: 'notifications', icon: 'bell', label: 'Notifications' }];
function NavRail(p) {
  var badges = p.badges || {}, st = useState(p.active || 'chats'), cur = p.active || st[0];
  function item(it) {
    var on = cur === it.id;
    return h(Tooltip, { key: it.id, label: it.label, side: 'right' }, h('button', { type: 'button', className: cx('rl-rail-btn', on && 'rl-rail-active'), 'aria-label': it.label, 'aria-current': on ? 'page' : undefined, onClick: function () { st[1](it.id); p.onChange && p.onChange(it.id); } },
      h(Icon, { name: it.icon, size: 22 }), badges[it.id] ? h(Badge, { count: badges[it.id], tone: it.id === 'calls' ? 'danger' : 'primary', className: 'rl-rail-badge' }) : null));
  }
  return h('nav', { className: cx('rl-rail', p.className), 'aria-label': 'Main' },
    h('div', { className: 'rl-rail-logo' }, h(AppLogo, { size: 36, wordmark: false })),
    h('div', { className: 'rl-rail-items' }, NAV.map(item)),
    h('div', { className: 'rl-rail-foot' }, item({ id: 'settings', icon: 'settings', label: 'Settings' }),
      h('button', { type: 'button', className: 'rl-rail-me', 'aria-label': 'Your profile', onClick: function () { p.onChange && p.onChange('profile'); } }, h(Avatar, { name: (p.user && p.user.name) || 'You', size: 36, presence: 'online' }))));
}

/* ---------- MessageStatus ---------- */
function StatusTick(p) {
  var s = p.status;
  if (s === 'sending') return h('span', { className: 'rl-tick rl-tick-sending', title: 'Sending', role: 'img', 'aria-label': 'Sending' }, h(Icon, { name: 'clock', size: 14 }));
  if (s === 'failed') return h('span', { className: 'rl-tick rl-tick-failed', title: 'Not sent', role: 'img', 'aria-label': 'Not sent' }, h(Icon, { name: 'alert', size: 14 }));
  if (s === 'sent') return h('span', { className: 'rl-tick', title: 'Sent', role: 'img', 'aria-label': 'Sent' }, h(Icon, { name: 'check', size: 15 }));
  if (s === 'delivered') return h('span', { className: 'rl-tick', title: 'Delivered', role: 'img', 'aria-label': 'Delivered' }, h(Icon, { name: 'check-check', size: 15 }));
  if (s === 'read') return h('span', { className: 'rl-tick rl-tick-read', title: 'Read', role: 'img', 'aria-label': 'Read' }, h(Icon, { name: 'check-check', size: 15 }));
  return null;
}

/* ---------- ConversationItem ---------- */
function ConversationItem(p) {
  var preview = p.typing ? h('span', { className: 'rl-conv-typing' }, 'typing…')
    : p.inCall ? h('span', { className: 'rl-conv-incall' }, h(Icon, { name: 'phone', size: 13 }), ' In a call')
    : h('span', null, p.fromMe ? h('span', { className: 'rl-conv-you' }, 'You: ') : null, p.preview);
  return h('button', { type: 'button', className: cx('rl-conv', p.selected && 'rl-conv-selected', p.unread && 'rl-conv-unread', p.className), 'aria-current': p.selected ? 'true' : undefined, onClick: p.onClick },
    h(Avatar, { name: p.name, size: 48, presence: p.inCall ? 'in-call' : p.presence }),
    h('span', { className: 'rl-conv-main' },
      h('span', { className: 'rl-conv-top' }, h('span', { className: 'rl-conv-name' }, p.name), h('span', { className: 'rl-conv-time' }, p.time)),
      h('span', { className: 'rl-conv-bottom' },
        p.fromMe && p.status ? h(StatusTick, { status: p.status }) : null,
        h('span', { className: 'rl-conv-preview' }, preview),
        p.unread ? h(Badge, { count: p.unread }) : null)));
}

/* ---------- FriendItem ---------- */
function FriendItem(p) {
  var mode = p.mode || 'friend';
  var statusText = p.statusText || (p.status === 'online' ? 'Online' : p.status === 'in-call' ? 'In a call' : p.lastSeen ? 'Last seen ' + p.lastSeen : 'Offline');
  var sub = mode === 'friend' ? h('span', { className: cx('rl-friend-status', 'rl-friend-status-' + (p.status || 'offline')) }, statusText)
    : mode === 'incoming' || mode === 'outgoing' ? h('span', { className: 'rl-friend-status' }, (mode === 'incoming' ? 'Sent you a request · ' : 'Request sent · ') + (p.time || ''))
    : null;
  var actions;
  if (mode === 'friend') actions = [
    h(Button, { key: 'm', variant: 'ghost', icon: 'chats', label: 'Message', onClick: p.onMessage }),
    h(Button, { key: 'v', variant: 'ghost', icon: 'phone', label: 'Voice call', onClick: p.onVoiceCall }),
    h(Button, { key: 'c', variant: 'ghost', icon: 'video', label: 'Video call', onClick: p.onVideoCall }),
    h(DropdownMenu, { key: 'x', items: [{ label: 'View profile', icon: 'user', onSelect: p.onViewProfile }, { divider: true }, { label: 'Unfriend', icon: 'user-x', danger: true, onSelect: p.onUnfriend }] })];
  else if (mode === 'incoming') actions = [h(Button, { key: 'r', variant: 'secondary', size: 'sm', onClick: p.onReject }, 'Reject'), h(Button, { key: 'a', size: 'sm', onClick: p.onAccept }, 'Accept')];
  else if (mode === 'outgoing') actions = [h('span', { key: 'p', className: 'rl-chip' }, h(Icon, { name: 'clock', size: 14 }), 'Pending')];
  else {
    var rel = p.relationship || 'none';
    actions = [rel === 'friends' ? h('span', { key: 'f', className: 'rl-chip rl-chip-ok' }, h(Icon, { name: 'user-check', size: 14 }), 'Friends')
      : rel === 'pending' ? h('span', { key: 'p', className: 'rl-chip' }, h(Icon, { name: 'clock', size: 14 }), 'Pending')
      : rel === 'incoming' ? h(Button, { key: 'a', size: 'sm', icon: 'check', onClick: p.onAccept, loading: p.loading }, 'Accept')
      : h(Button, { key: 'a', size: 'sm', variant: 'secondary', icon: 'user-plus', onClick: p.onAdd, loading: p.loading }, 'Add friend')];
  }
  return h('div', { className: cx('rl-friend', p.className) },
    h(Avatar, { name: p.name, size: mode === 'search' ? 40 : 48, presence: mode === 'friend' ? (p.status || 'offline') : undefined }),
    h('div', { className: 'rl-friend-main' },
      h('div', { className: 'rl-friend-name' }, p.name, h('span', { className: 'rl-friend-user' }, '@' + p.username)),
      sub),
    h('div', { className: 'rl-friend-actions' }, actions));
}

/* ---------- ChatHeader ---------- */
function ChatHeader(p) {
  var st = p.status || 'offline';
  var text = st === 'online' ? 'Online' : st === 'in-call' ? 'In a call' : p.lastSeen ? 'Last seen ' + p.lastSeen : 'Offline';
  return h('header', { className: cx('rl-chathead', p.className) },
    p.onBack ? h(Button, { variant: 'ghost', icon: 'back', label: 'Back', onClick: p.onBack, className: 'rl-chathead-back' }) : null,
    h('button', { type: 'button', className: 'rl-chathead-peer', onClick: p.onOpenProfile },
      h(Avatar, { name: p.name, size: 40, presence: st }),
      h('span', { className: 'rl-chathead-text' }, h('span', { className: 'rl-chathead-name' }, p.name), h('span', { className: cx('rl-chathead-status', 'rl-chathead-' + st) }, text))),
    h('div', { className: 'rl-chathead-actions' },
      h(Button, { variant: 'ghost', icon: 'phone', label: 'Voice call', onClick: p.onVoiceCall, disabled: p.callDisabled }),
      h(Button, { variant: 'ghost', icon: 'video', label: 'Video call', onClick: p.onVideoCall, disabled: p.callDisabled }),
      h(DropdownMenu, { items: p.menuItems || [{ label: 'View profile', icon: 'user', onSelect: p.onOpenProfile }, { label: 'Call history', icon: 'phone', onSelect: p.onCallHistory }, { divider: true }, { label: 'Unfriend', icon: 'user-x', danger: true, onSelect: p.onUnfriend }] })));
}

/* ---------- MessageBubble ---------- */
function MessageBubble(p) {
  var dir = p.direction || 'in', pos = p.position || 'single';
  return h('div', { className: cx('rl-msg', 'rl-msg-' + dir, 'rl-msg-' + pos, p.status === 'failed' && 'rl-msg-failed', p.className) },
    h('div', { className: 'rl-bubble' },
      h('span', { className: 'rl-bubble-text' }, p.text || p.children),
      h('span', { className: 'rl-bubble-meta' }, p.showTime === false ? null : h('span', null, p.time), dir === 'out' ? h(StatusTick, { status: p.status || 'sent' }) : null)),
    p.status === 'failed' ? h('div', { className: 'rl-msg-retry' }, h('span', null, 'Not sent.'), h('button', { type: 'button', onClick: p.onRetry }, h(Icon, { name: 'retry', size: 13 }), 'Retry')) : null);
}
function MessageSeparator(p) {
  var kind = p.kind || 'date';
  if (kind === 'loading') return h('div', { className: 'rl-sep rl-sep-loading', role: 'status' }, h(Icon, { name: 'loader', size: 16, spin: true }), h('span', null, p.label || 'Loading older messages…'));
  return h('div', { className: cx('rl-sep', 'rl-sep-' + kind), role: 'separator' }, h('span', null, p.label || (kind === 'unread' ? 'Unread messages' : 'Today')));
}

/* ---------- Composer ---------- */
function Composer(p) {
  var max = p.maxLength || 2000;
  var st = useState(p.defaultValue || ''), val = p.value != null ? p.value : st[0];
  var ref = useRef(null);
  useEffect(function () { var t = ref.current; if (!t) return; t.style.height = 'auto'; t.style.height = Math.min(t.scrollHeight, 160) + 'px'; }, [val]);
  var trimmed = val.trim(), over = val.length > max, blocked = p.disabled || p.offline;
  var canSend = trimmed.length > 0 && !over && !blocked;
  function set(v) { if (p.value == null) st[1](v); p.onChange && p.onChange(v); }
  function send() { if (!canSend) return; p.onSend && p.onSend(trimmed); set(''); }
  var near = val.length > max * 0.9;
  return h('div', { className: cx('rl-composer', p.disabled && 'rl-composer-disabled', p.className) },
    p.offline ? h('div', { className: 'rl-composer-note' }, h(Icon, { name: 'wifi-off', size: 14 }), 'Offline — your draft is kept and can be sent when you reconnect.') : null,
    h('div', { className: 'rl-composer-box' },
      h(Button, { variant: 'ghost', icon: 'smile', label: 'Emoji', className: 'rl-composer-emoji', disabled: p.disabled }),
      h('textarea', { ref: ref, className: 'rl-composer-input', rows: 1, placeholder: p.placeholder || 'Write a message…', value: val, disabled: p.disabled, 'aria-label': 'Message',
        onChange: function (e) { set(e.target.value); },
        onKeyDown: function (e) { if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); send(); } } }),
      near ? h('span', { className: cx('rl-composer-count', over && 'rl-composer-over') }, (max - val.length)) : null,
      h(Button, { icon: 'send', label: 'Send', className: 'rl-composer-send', disabled: !canSend, onClick: send })),
    over ? h('div', { className: 'rl-composer-error' }, 'Message is too long (max ' + max + ' characters).') : null);
}

/* ---------- NotificationItem ---------- */
var NOTI = { 'friend-request': { icon: 'user-plus', tone: 'primary' }, 'missed-call': { icon: 'phone-missed', tone: 'danger' }, message: { icon: 'chats', tone: 'neutral' }, 'request-accepted': { icon: 'user-check', tone: 'success' } };
function NotificationItem(p) {
  var m = NOTI[p.type] || NOTI.message;
  return h('div', { className: cx('rl-noti', p.unread && 'rl-noti-unread', p.className), onClick: p.onClick, role: p.onClick ? 'button' : undefined, tabIndex: p.onClick ? 0 : undefined },
    h('span', { className: 'rl-noti-avatar' }, h(Avatar, { name: p.name, size: 40 }), h('span', { className: cx('rl-noti-kind', 'rl-noti-' + m.tone) }, h(Icon, { name: m.icon, size: 12, strokeWidth: 2 }))),
    h('div', { className: 'rl-noti-main' }, h('div', { className: 'rl-noti-text' }, h('strong', null, p.name), ' ', p.text), h('div', { className: 'rl-noti-time' }, p.time),
      p.actions || p.children ? h('div', { className: 'rl-noti-actions' }, p.actions || p.children)
        : (p.onAccept || p.onReject) ? h('div', { className: 'rl-noti-actions' },
          h(Button, { size: 'sm', onClick: function (e) { e.stopPropagation(); p.onAccept && p.onAccept(); } }, p.acceptLabel || 'Accept'),
          h(Button, { size: 'sm', variant: 'secondary', onClick: function (e) { e.stopPropagation(); p.onReject && p.onReject(); } }, p.rejectLabel || 'Reject'))
        : null),
    p.unread ? h(Badge, { dot: true, className: 'rl-noti-dot' }) : null);
}

/* ---------- CallHistoryItem ---------- */
var CALL_STATUS = { completed: 'Completed', missed: 'Missed', rejected: 'Declined', failed: 'Failed', cancelled: 'Cancelled' };
function CallHistoryItem(p) {
  var dir = p.direction || 'outgoing', st = p.status || 'completed', bad = st === 'missed' || st === 'failed';
  var dirIcon = st === 'missed' ? 'phone-missed' : dir === 'incoming' ? 'phone-incoming' : 'phone-outgoing';
  return h('div', { className: cx('rl-callrow', bad && 'rl-callrow-bad', p.className) },
    h(Avatar, { name: p.name, size: 40 }),
    h('div', { className: 'rl-callrow-main' },
      h('div', { className: 'rl-callrow-name' }, p.name),
      h('div', { className: 'rl-callrow-meta' },
        h(Icon, { name: dirIcon, size: 14, className: 'rl-callrow-dir' }),
        h('span', { className: 'rl-callrow-status' }, (dir === 'incoming' ? 'Incoming' : 'Outgoing') + ' · ' + CALL_STATUS[st]),
        h('span', { className: 'rl-callrow-media' }, '· ', h(Icon, { name: p.media === 'video' ? 'video' : 'phone', size: 13 }), p.media === 'video' ? ' Video' : ' Voice'),
        st === 'completed' && p.duration ? h('span', null, '· ' + p.duration) : null)),
    h('div', { className: 'rl-callrow-time' }, p.time),
    h('div', { className: 'rl-callrow-actions' },
      h(Button, { variant: 'ghost', icon: 'phone', label: 'Voice call ' + p.name, onClick: p.onVoiceCall }),
      h(Button, { variant: 'ghost', icon: 'video', label: 'Video call ' + p.name, onClick: p.onVideoCall })));
}

/* ---------- CallControl ---------- */
var CTRL = {
  mic: { on: 'mic', off: 'mic-off', onLabel: 'Mute microphone', offLabel: 'Unmute microphone' },
  camera: { on: 'video', off: 'video-off', onLabel: 'Turn camera off', offLabel: 'Turn camera on' },
  speaker: { on: 'speaker', off: 'speaker', onLabel: 'Audio devices', offLabel: 'Audio devices' },
  settings: { on: 'settings', off: 'settings', onLabel: 'Device settings', offLabel: 'Device settings' },
  end: { on: 'phone-off', onLabel: 'End call' },
  reject: { on: 'phone-off', onLabel: 'Decline' },
  accept: { on: 'phone', onLabel: 'Accept' },
  'accept-video': { on: 'video', onLabel: 'Accept with video' }
};
function CallControl(p) {
  var k = p.kind || 'mic', m = CTRL[k], off = p.active === false;
  var tone = k === 'end' || k === 'reject' ? 'danger' : k === 'accept' || k === 'accept-video' ? 'success' : off ? 'off' : 'on';
  var label = p.label || (off ? m.offLabel : m.onLabel);
  var s = p.size || 56;
  return h('span', { className: 'rl-cc-wrap' },
    h('button', { type: 'button', className: cx('rl-cc', 'rl-cc-' + tone, p.className), style: { width: s, height: s }, 'aria-label': label, title: label, 'aria-pressed': (k === 'mic' || k === 'camera') ? off : undefined, onClick: p.onClick, disabled: p.disabled },
      h(Icon, { name: off ? m.off : m.on, size: Math.round(s * 0.42) })),
    p.showLabel ? h('span', { className: 'rl-cc-label' }, p.caption || label) : null);
}

/* ---------- IncomingCall ---------- */
function IncomingCall(p) {
  var video = p.media === 'video';
  var card = h('div', { className: cx('rl-incoming', p.className), role: 'alertdialog', 'aria-label': 'Incoming ' + (video ? 'video' : 'voice') + ' call from ' + p.name },
    h('div', { className: 'rl-incoming-kind' }, h(Icon, { name: video ? 'video' : 'phone', size: 14 }), video ? 'Incoming video call' : 'Incoming voice call'),
    h('div', { className: 'rl-ring' }, h('span', { className: 'rl-ring-wave' }), h('span', { className: 'rl-ring-wave rl-ring-wave-2' }), h(Avatar, { name: p.name, size: 96 })),
    h('div', { className: 'rl-incoming-name' }, p.name),
    h('div', { className: 'rl-incoming-user' }, p.username ? '@' + p.username : ''),
    h('div', { className: 'rl-incoming-actions' },
      h(CallControl, { kind: 'reject', showLabel: true, caption: 'Decline', onClick: p.onReject }),
      h(CallControl, { kind: video ? 'accept-video' : 'accept', showLabel: true, caption: 'Accept', onClick: p.onAccept })),
    h('div', { className: 'rl-incoming-timeout', 'aria-hidden': true }, h('span', { style: { animationDuration: (p.timeoutSec || 30) + 's' } })));
  return p.overlay ? h('div', { className: cx('rl-scrim', p.inline && 'rl-scrim-inline') }, card) : card;
}

/* ---------- CallStage ---------- */
var STAGE_TEXT = { permission: 'Waiting for camera and microphone permission…', ringing: 'Ringing…', calling: 'Calling…', connecting: 'Connecting…', reconnecting: 'Poor connection. Reconnecting…', ended: 'Call ended', failed: 'Call failed', disconnected: 'The other person left the call' };
function StreamVideo(p) {
  var ref = useRef(null);
  useEffect(function () { if (ref.current && ref.current.srcObject !== p.stream) ref.current.srcObject = p.stream || null; }, [p.stream]);
  return h('video', { ref: ref, className: cx('rl-video', p.mirror && 'rl-video-mirror'), autoPlay: true, playsInline: true, muted: !!p.muted });
}
function fakeVideo(name, big, stream, mirror) {
  if (stream) return h(StreamVideo, { stream: stream, muted: !big, mirror: mirror });
  return h('div', { className: cx('rl-feed', big && 'rl-feed-big'), 'aria-label': 'Video of ' + name, role: 'img' },
    h('svg', { viewBox: '0 0 160 100', preserveAspectRatio: 'xMidYMax meet', className: 'rl-feed-figure', 'aria-hidden': true },
      h('circle', { cx: 80, cy: 44, r: 20 }), h('path', { d: 'M38 100c0-24 19-38 42-38s42 14 42 38Z' })));
}
function CallStage(p) {
  var media = p.media || 'voice', state = p.state || 'connected', name = p.name || 'Minh Anh';
  var micOn = p.micOn !== false, camOn = p.camOn !== false && media === 'video';
  var live = state === 'connected' || state === 'reconnecting';
  var showRemoteVideo = media === 'video' && live && p.remoteCamera !== false;
  var statusLine = state === 'connected' ? (p.duration || '00:00') : STAGE_TEXT[state];
  var center = h('div', { className: 'rl-stage-center' },
    h('div', { className: cx('rl-stage-avatar', (state === 'ringing' || state === 'calling') && 'rl-ring') },
      (state === 'ringing' || state === 'calling') ? [h('span', { key: 1, className: 'rl-ring-wave' }), h('span', { key: 2, className: 'rl-ring-wave rl-ring-wave-2' })] : null,
      h(Avatar, { name: name, size: 128 }),
      p.remoteMuted && live ? h('span', { className: 'rl-stage-muted', title: name + ' is muted', role: 'img', 'aria-label': name + ' is muted' }, h(Icon, { name: 'mic-off', size: 16 })) : null),
    h('div', { className: 'rl-stage-name' }, name),
    h('div', { className: cx('rl-stage-status', state === 'connected' && 'rl-stage-timer', (state === 'failed') && 'rl-stage-bad') },
      state === 'connecting' || state === 'permission' ? h(Icon, { name: 'loader', size: 16, spin: true }) : null,
      h('span', null, statusLine)),
    media === 'video' && live && p.remoteCamera === false ? h('div', { className: 'rl-stage-camoff' }, h(Icon, { name: 'video-off', size: 14 }), 'Camera is off') : null,
    state === 'ended' && p.summary ? h('div', { className: 'rl-stage-summary' }, p.summary) : null,
    (state === 'ended' || state === 'failed' || state === 'disconnected') && p.endActions ? h('div', { className: 'rl-stage-endactions' }, p.endActions) : null);
  var over = state === 'ended' || state === 'failed' || state === 'disconnected';
  var controls = over ? null : h('div', { className: 'rl-stage-controls' },
    h(CallControl, { kind: 'mic', active: micOn, onClick: p.onToggleMic, disabled: state === 'permission' }),
    media === 'video' ? h(CallControl, { kind: 'camera', active: camOn, onClick: p.onToggleCamera, disabled: state === 'permission' }) : null,
    h(CallControl, { kind: media === 'video' ? 'settings' : 'speaker', onClick: p.onDevices }),
    h(CallControl, { kind: 'end', label: live ? 'End call' : 'Cancel call', onClick: p.onEnd }));
  return h('section', { className: cx('rl-stage', 'rl-stage-' + media, p.className), 'aria-label': (media === 'video' ? 'Video' : 'Voice') + ' call with ' + name },
    h('div', { className: 'rl-stage-top' },
      h('div', { className: 'rl-stage-peer' }, showRemoteVideo ? [h('span', { key: 'n', className: 'rl-stage-topname' }, name), h('span', { key: 't', className: 'rl-stage-toptime' }, p.duration || '00:00')] : h('span', { className: 'rl-stage-kind' }, h(Icon, { name: media === 'video' ? 'video' : 'phone', size: 14 }), media === 'video' ? 'Video call' : 'Voice call')),
      live ? h('span', { className: cx('rl-stage-quality', state === 'reconnecting' && 'rl-stage-quality-bad'), title: state === 'reconnecting' ? 'Poor connection' : 'Good connection' }, h(Icon, { name: 'signal', size: 16 }), state === 'reconnecting' ? 'Poor' : 'Good') : null),
    state === 'reconnecting' ? h('div', { className: 'rl-stage-banner', role: 'status' }, h(Icon, { name: 'loader', size: 14, spin: true }), 'Poor connection. Reconnecting…') : null,
    showRemoteVideo ? h('div', { className: 'rl-stage-remote' }, fakeVideo(name, true, p.remoteStream), p.remoteMuted ? h('span', { className: 'rl-stage-remote-muted' }, h(Icon, { name: 'mic-off', size: 14 }), name + ' is muted') : null) : center,
    media === 'video' && !over ? h('div', { className: 'rl-stage-self' }, camOn ? fakeVideo('you', false, p.localStream, true) : h('div', { className: 'rl-stage-self-off' }, h(Avatar, { name: p.selfName || 'Duy Cường', size: 48 }), h('span', null, 'Camera off')), !micOn ? h('span', { className: 'rl-stage-self-muted', 'aria-label': 'You are muted', role: 'img' }, h(Icon, { name: 'mic-off', size: 12 })) : null) : null,
    controls);
}

export { Icon, AppLogo, Avatar, PresenceDot, Button, TextField, PasswordField, SearchInput, Tabs, Badge, Toast, Modal, DropdownMenu, Tooltip, Skeleton, EmptyState, ConnectionBanner, NavRail, ConversationItem, FriendItem, ChatHeader, MessageBubble, MessageSeparator, StatusTick as MessageStatus, Composer, NotificationItem, CallHistoryItem, CallControl, IncomingCall, CallStage };
