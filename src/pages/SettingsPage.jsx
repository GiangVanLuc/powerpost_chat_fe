import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Button, Icon, Modal } from '../design-system/index.js';
import { useApp } from '../store/AppStore.jsx';
import { stopStream } from '../services/webrtc.js';

function usePrefs() {
  const read = () => { try { return JSON.parse(localStorage.getItem('pp_prefs')) || {}; } catch (e) { return {}; } };
  const [prefs, setPrefs] = useState(() => ({ sound: true, desktop: true, mic: '', cam: '', speaker: '', ...read() }));
  const update = (p) => setPrefs((old) => { const next = { ...old, ...p }; try { localStorage.setItem('pp_prefs', JSON.stringify(next)); } catch (e) { /* ignore */ } return next; });
  return [prefs, update];
}

/** Device test: lists devices, shows a camera preview and a live microphone level. */
function DeviceTest({ prefs, update }) {
  const [devices, setDevices] = useState({ audioinput: [], videoinput: [], audiooutput: [] });
  const [perm, setPerm] = useState('unknown'); // unknown | granted | denied
  const [level, setLevel] = useState(0);
  const video = useRef(null);
  const stream = useRef(null);
  const raf = useRef(0);

  const listDevices = async () => {
    const all = await navigator.mediaDevices.enumerateDevices();
    const g = { audioinput: [], videoinput: [], audiooutput: [] };
    all.forEach((d) => { if (g[d.kind]) g[d.kind].push(d); });
    setDevices(g);
  };

  const start = async () => {
    if (!navigator.mediaDevices) { setPerm('denied'); return; }
    stopStream(stream.current); cancelAnimationFrame(raf.current);
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        audio: prefs.mic ? { deviceId: { exact: prefs.mic } } : true,
        video: prefs.cam ? { deviceId: { exact: prefs.cam } } : true
      });
      stream.current = s; setPerm('granted');
      if (video.current) video.current.srcObject = s;
      await listDevices();
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = ctx.createAnalyser(); analyser.fftSize = 256;
      ctx.createMediaStreamSource(s).connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      const loop = () => { analyser.getByteFrequencyData(data); setLevel(Math.min(16, Math.round((data.reduce((a, b) => a + b, 0) / data.length) / 6))); raf.current = requestAnimationFrame(loop); };
      loop();
    } catch (e) { setPerm('denied'); }
  };

  useEffect(() => {
    if (navigator.mediaDevices && navigator.permissions) {
      navigator.permissions.query({ name: 'camera' }).then((p) => { if (p.state === 'granted') start(); }).catch(() => {});
    }
    return () => { stopStream(stream.current); cancelAnimationFrame(raf.current); };
  }, [prefs.mic, prefs.cam]); // eslint-disable-line react-hooks/exhaustive-deps

  const select = (kind, key, label) => (
    <div className="pp-select-field">
      <label htmlFor={key}>{label}</label>
      <div className="pp-select-wrap">
        <select id={key} value={prefs[key]} disabled={perm !== 'granted' && kind !== 'audiooutput'} onChange={(e) => update({ [key]: e.target.value })}>
          <option value="">System default</option>
          {devices[kind].filter((d) => d.deviceId && d.deviceId !== 'default').map((d, i) => <option key={d.deviceId} value={d.deviceId}>{d.label || `${label} ${i + 1}`}</option>)}
        </select>
        <Icon name="chevron-down" size={18} />
      </div>
    </div>
  );

  return (
    <section className="pp-card pp-settings-card">
      <div><h2 className="pp-card-title">Audio &amp; video</h2><p className="pp-muted">Test your devices before a call.</p></div>
      {perm !== 'granted' && (
        <div className="pp-warn"><Icon name="alert" size={16} /><span>{perm === 'denied' ? 'Camera or microphone access is blocked. Allow it in your browser’s site settings.' : 'Allow camera and microphone access to choose devices.'}</span><Button size="sm" onClick={start}>{perm === 'denied' ? 'Try again' : 'Allow access'}</Button></div>
      )}
      <div className="pp-devices">
        <div className="pp-devices-fields">
          {select('audioinput', 'mic', 'Microphone')}
          <div className="pp-select-field">
            <span>Input level</span>
            <div className="pp-meter" role="meter" aria-label="Microphone input level" aria-valuemin={0} aria-valuemax={16} aria-valuenow={level}>
              {Array.from({ length: 16 }, (_, i) => <span key={i} className={i < level ? 'on' : ''} />)}
            </div>
          </div>
          {select('videoinput', 'cam', 'Camera')}
          {select('audiooutput', 'speaker', 'Speaker')}
        </div>
        <div className="pp-preview">
          <video ref={video} autoPlay playsInline muted />
          {perm !== 'granted' && <div className="pp-preview-off"><Icon name="video-off" size={24} />No camera access</div>}
          <span className="pp-preview-tag">Preview</span>
        </div>
      </div>
    </section>
  );
}

export default function SettingsPage() {
  const app = useApp();
  const [prefs, update] = usePrefs();
  const [confirm, setConfirm] = useState(false);
  const u = app.user;

  return (
    <div className="pp-page">
      <header className="pp-page-head"><h1 className="pp-title">Settings</h1></header>
      <div className="pp-page-body pp-scroll">
        <div className="pp-settings">
          <section className="pp-card pp-account">
            <Avatar name={u.displayName} id={u.username} src={u.avatarUrl || undefined} size={64} presence="online" />
            <div style={{ flex: 1, minWidth: 200 }}><div className="pp-card-title">{u.displayName}</div><div className="pp-muted">@{u.username} · {u.email}</div></div>
            <Link to="/profile/edit" className="pp-btn-link pp-btn-link-secondary">Edit profile</Link>
          </section>
          <DeviceTest prefs={prefs} update={update} />
          <section className="pp-card pp-settings-card">
            <h2 className="pp-card-title">Notifications</h2>
            <label className="pp-check"><input type="checkbox" checked={prefs.sound} onChange={(e) => update({ sound: e.target.checked })} />Play a sound for new messages</label>
            <label className="pp-check"><input type="checkbox" checked={prefs.desktop} onChange={(e) => { update({ desktop: e.target.checked }); if (e.target.checked && window.Notification && Notification.permission === 'default') Notification.requestPermission(); }} />Show browser notifications for calls and friend requests</label>
          </section>
          <div className="pp-settings-foot">
            <span className="pp-hint">PowerPost MVP · v0.1</span>
            <Button variant="secondary" icon="logout" onClick={() => setConfirm(true)}>Sign out</Button>
          </div>
        </div>
      </div>
      {confirm && <Modal title="Sign out of PowerPost?" description="You’ll stop receiving messages and calls on this device." icon="logout" onClose={() => setConfirm(false)}
        actions={<><Button variant="secondary" onClick={() => setConfirm(false)}>Cancel</Button><Button variant="danger" onClick={app.actions.logout}>Sign out</Button></>} />}
    </div>
  );
}
