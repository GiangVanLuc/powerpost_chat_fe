import React, { useEffect, useState } from 'react';
import { CallHistoryItem, EmptyState, Tabs } from '../design-system/index.js';
import { useApp } from '../store/AppStore.jsx';
import { dayLabel, duration, listTime, sameDay } from '../utils/format.js';

export default function CallsPage() {
  const app = useApp();
  const [filter, setFilter] = useState('all');
  useEffect(() => { app.actions.markCallsSeen(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const rows = app.calls.filter((c) => filter === 'all' || (filter === 'missed' ? c.status === 'missed' : c.media === filter));
  const groups = [];
  rows.forEach((c) => {
    const g = groups[groups.length - 1];
    if (g && sameDay(g.date, c.startedAt)) g.items.push(c); else groups.push({ date: c.startedAt, items: [c] });
  });
  const missed = app.calls.filter((c) => c.status === 'missed').length;

  return (
    <div className="pp-page">
      <header className="pp-page-head"><h1 className="pp-title">Calls</h1></header>
      <div className="pp-page-tabs">
        <Tabs value={filter} onChange={setFilter} items={[{ id: 'all', label: 'All' }, { id: 'missed', label: 'Missed', count: missed }, { id: 'voice', label: 'Voice' }, { id: 'video', label: 'Video' }]} />
      </div>
      <div className="pp-page-body pp-scroll">
        <div className="pp-card pp-calls">
          {rows.length === 0 && <EmptyState icon="phone" title={filter === 'missed' ? 'No missed calls' : 'No calls yet'} description="Start a voice or video call from any chat." />}
          {groups.map((g) => (
            <React.Fragment key={g.date}>
              <div className="pp-section-label">{dayLabel(g.date)}</div>
              {g.items.map((c) => (
                <CallHistoryItem key={c.id} name={app.users[c.peer]?.displayName || c.peer} direction={c.direction} media={c.media} status={c.status}
                  time={listTime(c.startedAt)} duration={c.duration ? duration(c.duration) : undefined}
                  onVoiceCall={() => app.actions.startCall(c.peer, 'voice')} onVideoCall={() => app.actions.startCall(c.peer, 'video')} />
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
