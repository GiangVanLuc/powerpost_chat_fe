import React, { useState } from 'react';
import { Icon } from '../design-system/index.js';
import { socket } from '../services/socket.js';

/** Mock mode only: buttons that make the fake server do things (flows 3 and 4 of the brief). */
export default function DemoPanel() {
  const [open, setOpen] = useState(false);
  return (
    <div className={`pp-demo${open ? ' pp-demo-open' : ''}`}>
      <button type="button" className="pp-demo-toggle" onClick={() => setOpen(!open)} aria-expanded={open}>
        <Icon name="settings" size={16} /> Demo
      </button>
      {open && (
        <div className="pp-demo-body">
          <div className="pp-section-label" style={{ margin: '0 0 6px' }}>Mock server</div>
          <button type="button" onClick={() => socket.simulateIncomingCall('minhanh', 'video')}>Incoming video call — Minh Anh</button>
          <button type="button" onClick={() => socket.simulateIncomingCall('hoangnam', 'voice')}>Incoming voice call — Hoàng Nam</button>
          <button type="button" onClick={() => socket.simulateIncomingCall('lanphuong', 'video', true)}>Incoming call nobody answers</button>
          <button type="button" onClick={() => socket.simulateDrop(4000)}>Drop connection for 4s</button>
        </div>
      )}
    </div>
  );
}
