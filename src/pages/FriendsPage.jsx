import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, EmptyState, FriendItem, Modal, SearchInput, Skeleton, Tabs } from '../design-system/index.js';
import { useApp } from '../store/AppStore.jsx';
import { ago } from '../utils/format.js';

export default function FriendsPage() {
  const app = useApp();
  const nav = useNavigate();
  const { tab = 'all' } = useParams();
  const [q, setQ] = useState('');
  const [adding, setAdding] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const loading = app.friends.length === 0 && app.convOrder.length === 0;

  const friends = app.friends.map((n) => app.users[n]).filter(Boolean)
    .filter((u) => !q || (u.displayName + ' ' + u.username).toLowerCase().includes(q.toLowerCase()));
  const online = friends.filter((u) => u.presence !== 'offline');
  const offline = friends.filter((u) => u.presence === 'offline');
  const groups = tab === 'online' ? [['Online', online]] : [['Online', online], ['Offline', offline]];

  const row = (u) => (
    <FriendItem key={u.username} name={u.displayName} username={u.username} status={u.presence} lastSeen={u.lastSeen ? ago(u.lastSeen) : undefined}
      onMessage={() => nav(`/chats/${u.username}`)}
      onVoiceCall={() => app.actions.startCall(u.username, 'voice')}
      onVideoCall={() => app.actions.startCall(u.username, 'video')}
      onViewProfile={() => nav(`/users/${u.username}`)}
      onUnfriend={() => setConfirm(u)} />
  );

  return (
    <div className="pp-page">
      <header className="pp-page-head">
        <h1 className="pp-title">Friends</h1>
        <div className="pp-page-search"><SearchInput placeholder="Search friends" value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ('')} /></div>
        <Button icon="user-plus" onClick={() => setAdding(true)}>Add friend</Button>
      </header>
      <div className="pp-page-tabs">
        <Tabs value={tab} onChange={(id) => nav(id === 'all' ? '/friends' : `/friends/${id}`)}
          items={[{ id: 'all', label: 'All' }, { id: 'online', label: 'Online' }, { id: 'requests', label: 'Requests', count: app.requests.incoming.length }]} />
      </div>
      <div className="pp-page-body pp-scroll">
        {tab === 'requests' ? <Requests /> : (
          <div className="pp-card">
            {loading && Array.from({ length: 6 }, (_, i) => <Skeleton key={i} variant="friend" />)}
            {!loading && friends.length === 0 && (q
              ? <EmptyState icon="search" title={`No results for “${q}”`} />
              : <EmptyState icon="users" title="No friends yet" description="Search by name or @username to send your first friend request." action={<Button icon="user-plus" onClick={() => setAdding(true)}>Add friend</Button>} />)}
            {!loading && groups.map(([title, list]) => list.length > 0 && (
              <React.Fragment key={title}>
                <div className="pp-section-label">{title} — {list.length}</div>
                {list.map(row)}
              </React.Fragment>
            ))}
            {!loading && tab === 'online' && friends.length > 0 && online.length === 0 && <EmptyState compact icon="users" title="Nobody is online right now" />}
          </div>
        )}
      </div>
      {adding && <AddFriendModal onClose={() => setAdding(false)} />}
      {confirm && (
        <Modal tone="danger" icon="user-x" title={`Unfriend ${confirm.displayName}?`} description="You will no longer be able to message or call each other. Your chat history stays." onClose={() => setConfirm(null)}
          actions={<><Button variant="secondary" onClick={() => setConfirm(null)}>Cancel</Button><Button variant="danger" onClick={() => { app.actions.unfriend(confirm.username); setConfirm(null); }}>Unfriend</Button></>} />
      )}
    </div>
  );
}

function Requests() {
  const app = useApp();
  const { incoming, outgoing } = app.requests;
  return (
    <div className="pp-requests">
      <section className="pp-card">
        <h2 className="pp-card-title">Incoming <span className="pp-muted">· {incoming.length}</span></h2>
        {incoming.length === 0 && <EmptyState compact icon="inbox" title="No pending requests" description="When someone adds you, it shows up here." />}
        {incoming.map((r) => {
          const u = app.users[r.username] || { username: r.username, displayName: r.username };
          return <FriendItem key={r.id} mode="incoming" name={u.displayName} username={u.username} time={ago(r.createdAt)} onAccept={() => app.actions.acceptRequest(r.id)} onReject={() => app.actions.rejectRequest(r.id)} />;
        })}
      </section>
      <section className="pp-card">
        <h2 className="pp-card-title">Outgoing <span className="pp-muted">· {outgoing.length}</span></h2>
        {outgoing.length === 0 && <EmptyState compact icon="user-plus" title="No sent requests" />}
        {outgoing.map((r) => {
          const u = app.users[r.username] || { username: r.username, displayName: r.username };
          return <FriendItem key={r.id} mode="outgoing" name={u.displayName} username={u.username} time={ago(r.createdAt)} />;
        })}
        {outgoing.length > 0 && <p className="pp-hint" style={{ margin: '8px 12px 12px' }}>You'll get a notification when they accept.</p>}
      </section>
    </div>
  );
}

function AddFriendModal({ onClose }) {
  const app = useApp();
  const [q, setQ] = useState('');
  const [state, setState] = useState({ loading: false, results: null });
  const [busy, setBusy] = useState(null);
  const t = useRef(null);

  useEffect(() => {
    clearTimeout(t.current);
    if (q.trim().length < 2) { setState({ loading: false, results: null }); return; }
    setState((s) => ({ ...s, loading: true }));
    t.current = setTimeout(async () => {
      try { setState({ loading: false, results: await app.actions.searchUsers(q.trim()) }); }
      catch (e) { setState({ loading: false, results: [] }); }
    }, 300);
    return () => clearTimeout(t.current);
  }, [q]); // eslint-disable-line react-hooks/exhaustive-deps

  const setRel = (username, relationship) => setState((s) => ({ ...s, results: s.results.map((r) => (r.username === username ? { ...r, relationship } : r)) }));
  const add = async (u) => { setBusy(u.username); try { await app.actions.sendFriendRequest(u.username); setRel(u.username, 'pending'); } finally { setBusy(null); } };
  const accept = async (u) => {
    const r = app.requests.incoming.find((x) => x.username === u.username);
    if (r) { await app.actions.acceptRequest(r.id); setRel(u.username, 'friends'); }
  };

  return (
    <Modal title="Add friend" description="Find people by name or @username." width={520} onClose={onClose}>
      <SearchInput autoFocus placeholder="Search by name or @username" value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ('')} />
      <div className="pp-search-results">
        {!state.results && !state.loading && <EmptyState compact icon="user-plus" title="Search for people" description="Type at least 2 characters." />}
        {state.loading && Array.from({ length: 4 }, (_, i) => <Skeleton key={i} variant="friend" />)}
        {!state.loading && state.results && state.results.length === 0 && <EmptyState compact icon="search" title={`No results for “${q}”`} description="Check the spelling, or search by exact @username." />}
        {!state.loading && state.results && state.results.map((u) => (
          <FriendItem key={u.username} mode="search" name={u.displayName} username={u.username} relationship={u.relationship} loading={busy === u.username}
            onAdd={() => add(u)} onAccept={() => accept(u)} />
        ))}
      </div>
    </Modal>
  );
}
