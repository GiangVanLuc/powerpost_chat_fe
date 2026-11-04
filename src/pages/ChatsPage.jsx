import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import {
  AppLogo, Button, ChatHeader, Composer, ConversationItem, EmptyState, MessageBubble, MessageSeparator, SearchInput, Skeleton
} from '../design-system/index.js';
import { useApp } from '../store/AppStore.jsx';
import { clock, dayLabel, listTime, sameDay, withPositions, ago } from '../utils/format.js';
import { MESSAGE_MAX_LENGTH } from '../services/config.js';

export default function ChatsPage() {
  const { username } = useParams();
  return (
    <div className={`pp-split${username ? ' pp-split-detail' : ''}`}>
      <ConversationList active={username} />
      <section className="pp-detail">
        {username ? <Conversation key={username} username={username} /> : (
          <div className="pp-center"><EmptyState icon="chats" title="Select a conversation to start messaging" description="Choose a friend from the list or start a new chat." /></div>
        )}
      </section>
    </div>
  );
}

function ConversationList({ active }) {
  const app = useApp();
  const nav = useNavigate();
  const { openNotifications } = useOutletContext() || {};
  const [q, setQ] = useState('');
  const loading = app.convOrder.length === 0 && app.friends.length === 0;
  const rows = app.convOrder
    .map((n) => ({ u: app.users[n] || { username: n, displayName: n }, c: app.conversations[n] || {} }))
    .filter(({ u }) => !q || (u.displayName + ' ' + u.username).toLowerCase().includes(q.toLowerCase()));

  return (
    <aside className="pp-list">
      <header className="pp-list-head">
        <h1 className="pp-title pp-only-desktop">Chats</h1>
        <span className="pp-only-mobile"><AppLogo size={28} /></span>
        <div className="pp-row-gap">
          <span className="pp-only-mobile"><Button variant="ghost" icon="bell" label="Notifications" onClick={openNotifications} /></span>
          <Button variant="ghost" icon="plus" label="New conversation" onClick={() => nav('/friends')} />
        </div>
      </header>
      <div className="pp-list-search"><SearchInput placeholder="Search conversations" value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ('')} /></div>
      <div className="pp-list-body pp-scroll">
        {loading && Array.from({ length: 7 }, (_, i) => <Skeleton key={i} variant="conversation" />)}
        {!loading && rows.length === 0 && (q
          ? <EmptyState compact icon="search" title={`No results for “${q}”`} />
          : <EmptyState compact icon="chats" title="No conversations yet" description="Add a friend to start chatting." action={<Button size="sm" icon="user-plus" onClick={() => nav('/friends')}>Add friend</Button>} />)}
        {rows.map(({ u, c }) => {
          const last = c.messages && c.messages.length ? c.messages[c.messages.length - 1] : c.preview;
          const fromMe = last && last.from === app.user.username;
          return (
            <ConversationItem key={u.username} name={u.displayName} preview={last ? last.text : 'Say hello'} time={last ? listTime(last.createdAt) : ''}
              unread={c.unread || 0} presence={u.presence} inCall={u.presence === 'in-call'} selected={active === u.username}
              fromMe={fromMe} status={fromMe ? last.status : undefined} onClick={() => nav(`/chats/${u.username}`)} />
          );
        })}
      </div>
    </aside>
  );
}

function Conversation({ username }) {
  const app = useApp();
  const nav = useNavigate();
  const peer = app.users[username];
  const conv = app.conversations[username] || { messages: [] };
  const unreadAtOpen = useRef(conv.unread || 0);
  const scroller = useRef(null);

  useEffect(() => { app.actions.openConversation(username); }, [username]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight; }, [conv.messages.length]);

  const items = useMemo(() => {
    const list = withPositions(conv.messages);
    const out = [];
    const firstUnread = unreadAtOpen.current ? list.length - unreadAtOpen.current : -1;
    list.forEach((m, i) => {
      if (i === 0 || !sameDay(list[i - 1].createdAt, m.createdAt)) out.push({ sep: 'date', key: 'd' + m.id, label: dayLabel(m.createdAt) });
      if (i === firstUnread) out.push({ sep: 'unread', key: 'u', label: `${unreadAtOpen.current} unread message${unreadAtOpen.current > 1 ? 's' : ''}` });
      out.push(m);
    });
    return out;
  }, [conv.messages]);

  if (!peer) {
    return <div className="pp-center"><EmptyState icon="compass" title="Conversation not found" description="This person isn’t in your friends list." action={<Button variant="secondary" icon="back" onClick={() => nav('/chats')}>Back to chats</Button>} /></div>;
  }
  const offline = app.connection !== 'online';
  const isFriend = app.friends.includes(username);

  return (
    <div className="pp-conv">
      <ChatHeader name={peer.displayName} status={peer.presence} lastSeen={peer.lastSeen ? ago(peer.lastSeen) : undefined}
        callDisabled={offline || peer.presence === 'in-call' || !isFriend}
        onBack={() => nav('/chats')}
        onOpenProfile={() => nav(`/users/${username}`)}
        onVoiceCall={() => app.actions.startCall(username, 'voice')}
        onVideoCall={() => app.actions.startCall(username, 'video')}
        onCallHistory={() => nav('/calls')}
        onUnfriend={() => app.actions.unfriend(username)} />
      <div className="pp-messages pp-scroll" ref={scroller}>
        <div className="pp-messages-inner">
          {conv.loading && <><MessageSeparator kind="loading" />{[220, 300, 180, 260].map((w, i) => <Skeleton key={i} variant="message" width={w} out={i % 2 === 1} />)}</>}
          {!conv.loading && conv.messages.length === 0 && <EmptyState icon="chats" title="No messages yet" description={`Say hello to ${peer.displayName}.`} />}
          {items.map((m) => m.sep
            ? <MessageSeparator key={m.key} kind={m.sep} label={m.label} />
            : <MessageBubble key={m.clientId || m.id} direction={m.from === app.user.username ? 'out' : 'in'} text={m.text} time={clock(m.createdAt)}
                status={m.status} position={m.position} onRetry={() => app.actions.retryMessage(username, m.clientId)} />)}
        </div>
      </div>
      <Composer maxLength={MESSAGE_MAX_LENGTH} offline={offline} disabled={!isFriend} placeholder={isFriend ? 'Write a message…' : 'You can only message friends'}
        onSend={(text) => app.actions.sendMessage(username, text)} />
    </div>
  );
}
