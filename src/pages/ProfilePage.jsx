import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Avatar, Button, EmptyState } from '../design-system/index.js';
import { useApp } from '../store/AppStore.jsx';
import { ago } from '../utils/format.js';

const STATUS = { online: 'Online', 'in-call': 'In a call' };

export default function ProfilePage() {
  const app = useApp();
  const nav = useNavigate();
  const { username } = useParams();
  const own = !username || username === app.user.username;
  const u = own ? { ...app.user, presence: 'online' } : app.users[username];

  if (!u) {
    return <div className="pp-page"><div className="pp-center"><EmptyState icon="compass" title="Page not found" description="This profile doesn’t exist, or you no longer have access." action={<Button variant="secondary" icon="back" onClick={() => nav('/friends')}>Back to friends</Button>} /></div></div>;
  }
  const isFriend = app.friends.includes(u.username);
  const status = STATUS[u.presence] || (u.lastSeen ? `Last seen ${ago(u.lastSeen)}` : 'Offline');

  return (
    <div className="pp-page">
      <header className="pp-page-head"><h1 className="pp-title">{own ? 'My profile' : 'Profile'}</h1></header>
      <div className="pp-page-body pp-scroll">
        <section className="pp-card pp-profile">
          <Avatar name={u.displayName} id={u.username} src={u.avatarUrl || undefined} size={96} presence={u.presence} />
          <div>
            <div className="pp-profile-name">{u.displayName}</div>
            <div className="pp-muted">@{u.username}</div>
            <div className={`pp-profile-status pp-status-${u.presence || 'offline'}`}>{status}</div>
          </div>
          {u.bio ? <p className="pp-profile-bio">{u.bio}</p> : null}
          {own ? (
            <div className="pp-profile-own">
              <div className="pp-kv"><span>Email</span><span>{u.email}</span></div>
              <div className="pp-kv"><span>Member since</span><span>{new Date(u.createdAt || Date.now()).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</span></div>
              <div className="pp-profile-actions"><Link className="pp-btn-link" to="/profile/edit">Edit profile</Link></div>
            </div>
          ) : isFriend ? (
            <div className="pp-row-gap">
              <Button icon="chats" onClick={() => nav(`/chats/${u.username}`)}>Message</Button>
              <Button variant="secondary" icon="phone" onClick={() => app.actions.startCall(u.username, 'voice')}>Voice call</Button>
              <Button variant="secondary" icon="video" onClick={() => app.actions.startCall(u.username, 'video')}>Video call</Button>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
