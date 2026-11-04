import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, EmptyState, NotificationItem } from '../design-system/index.js';
import { useApp } from '../store/AppStore.jsx';
import { ago } from '../utils/format.js';

export default function NotificationsPanel({ onClose }) {
  const app = useApp();
  const nav = useNavigate();
  const items = app.notifications;
  const fresh = items.filter((n) => Date.now() - new Date(n.createdAt) < 86400000);
  const earlier = items.filter((n) => !fresh.includes(n));

  useEffect(() => {
    const k = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);

  const open = (n) => {
    app.actions.markRead(n.id);
    onClose();
    if (n.type === 'missed-call') nav('/calls');
    else if (n.type === 'friend-request') nav('/friends/requests');
    else nav(`/chats/${n.from}`);
  };

  const row = (n) => (
    <NotificationItem key={n.id} type={n.type} name={app.users[n.from]?.displayName || n.from} text={n.text} time={ago(n.createdAt)} unread={!n.read}
      onClick={() => open(n)}
      onAccept={n.type === 'friend-request' ? () => app.actions.acceptRequest(n.requestId) : undefined}
      onReject={n.type === 'friend-request' ? () => app.actions.rejectRequest(n.requestId) : undefined} />
  );

  return (
    <>
      <div className="pp-noti-scrim" onClick={onClose} />
      <aside className="pp-noti" role="dialog" aria-label="Notifications">
        <header className="pp-noti-head">
          <h2 className="pp-title">Notifications</h2>
          <Button variant="ghost" size="sm" disabled={!items.some((n) => !n.read)} onClick={app.actions.markAllRead}>Mark all as read</Button>
          <Button variant="ghost" size="sm" icon="x" label="Close" onClick={onClose} />
        </header>
        <div className="pp-noti-body">
          {items.length === 0 && <EmptyState icon="bell" title="You're all caught up" description="Friend requests, missed calls and message summaries show up here." />}
          {fresh.length > 0 && <div className="pp-section-label">New</div>}
          {fresh.map(row)}
          {earlier.length > 0 && <div className="pp-section-label">Earlier</div>}
          {earlier.map(row)}
        </div>
      </aside>
    </>
  );
}
