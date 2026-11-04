import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { NavRail, ConnectionBanner, Icon } from '../design-system/index.js';
import { useApp } from '../store/AppStore.jsx';
import NotificationsPanel from './NotificationsPanel.jsx';
import DemoPanel from './DemoPanel.jsx';
import { USE_MOCK } from '../services/config.js';

const PATH = { chats: '/chats', friends: '/friends', calls: '/calls', settings: '/settings', profile: '/profile' };

/** Desktop: NavRail + routed content. Mobile (<768): routed content + bottom nav. */
export default function AppShell() {
  const app = useApp();
  const nav = useNavigate();
  const loc = useLocation();
  const [notiOpen, setNotiOpen] = useState(false);
  const section = loc.pathname.split('/')[1] || 'chats';
  const unread = Object.values(app.conversations).reduce((a, c) => a + (c.unread || 0), 0);
  const missed = app.calls.filter((c) => c.status === 'missed' && !c.seen).length;
  const notiUnread = app.notifications.filter((n) => !n.read).length;
  const inChat = /^\/chats\/.+/.test(loc.pathname);
  const banner = app.connection === 'reconnecting' || app.connection === 'offline' ? app.connection : app.showRestored ? 'restored' : null;

  const onNav = (id) => {
    if (id === 'notifications') { setNotiOpen((o) => !o); return; }
    setNotiOpen(false);
    nav(PATH[id] || '/chats');
  };

  return (
    <div className={`pp-shell${inChat ? ' pp-in-chat' : ''}`}>
      <div className="pp-rail">
        <NavRail active={notiOpen ? 'notifications' : section === 'users' ? 'friends' : section} badges={{ chats: unread, notifications: notiUnread, calls: missed }} user={{ name: app.user.displayName }} onChange={onNav} />
      </div>
      <div className="pp-main">
        {banner && <ConnectionBanner state={banner} onRetry={app.actions.retryConnection} />}
        <div className="pp-outlet"><Outlet context={{ openNotifications: () => setNotiOpen(true) }} /></div>
        <nav className="pp-bottomnav" aria-label="Main">
          {[['chats', 'chats', 'Chats', unread], ['friends', 'users', 'Friends', 0], ['calls', 'phone', 'Calls', missed], ['settings', 'settings', 'Settings', 0]].map(([id, icon, label, n]) => (
            <NavLink key={id} to={PATH[id]} className={({ isActive }) => `pp-bn${isActive ? ' pp-bn-on' : ''}`}>
              <span className="pp-bn-icon"><Icon name={icon} size={22} />{n ? <span className="pp-bn-badge">{n > 99 ? '99+' : n}</span> : null}</span>
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
      {notiOpen && <NotificationsPanel onClose={() => setNotiOpen(false)} />}
      {USE_MOCK && <DemoPanel />}
    </div>
  );
}
