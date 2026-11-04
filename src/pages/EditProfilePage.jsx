import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, Button, Icon, TextField } from '../design-system/index.js';
import { useApp } from '../store/AppStore.jsx';

const BIO_MAX = 160;

export default function EditProfilePage() {
  const app = useApp();
  const nav = useNavigate();
  const [f, setF] = useState({ displayName: app.user.displayName, bio: app.user.bio || '', avatarUrl: app.user.avatarUrl || '' });
  const [saving, setSaving] = useState(false);
  const nameErr = !f.displayName.trim() ? 'Display name can’t be empty.' : null;
  const urlErr = f.avatarUrl && !/^https?:\/\/.+/.test(f.avatarUrl) ? 'Use a full https:// link.' : null;

  const save = async (e) => {
    e.preventDefault();
    if (nameErr || urlErr) return;
    setSaving(true);
    try { await app.actions.updateProfile({ displayName: f.displayName.trim(), bio: f.bio.trim(), avatarUrl: f.avatarUrl.trim() }); nav('/profile'); }
    catch (err) { app.actions.toast('error', "Couldn't save your profile", err.message); setSaving(false); }
  };

  return (
    <div className="pp-page">
      <header className="pp-page-head">
        <Link to="/profile" className="pp-icon-link" aria-label="Back to profile"><Icon name="back" /></Link>
        <h1 className="pp-title">Edit profile</h1>
      </header>
      <div className="pp-page-body pp-scroll">
        <form className="pp-card pp-form" onSubmit={save} noValidate>
          <div className="pp-row-gap" style={{ alignItems: 'flex-start' }}>
            <Avatar name={f.displayName || app.user.displayName} id={app.user.username} src={!urlErr && f.avatarUrl ? f.avatarUrl : undefined} size={64} />
            <div style={{ flex: 1 }}><TextField label="Avatar URL" placeholder="https://…/avatar.png" value={f.avatarUrl} error={urlErr || undefined} help="Leave empty to use your initials." onChange={(e) => setF({ ...f, avatarUrl: e.target.value })} /></div>
          </div>
          <TextField label="Display name" value={f.displayName} error={nameErr || undefined} onChange={(e) => setF({ ...f, displayName: e.target.value })} />
          <TextField label="Username" value={app.user.username} disabled help="Your username can’t be changed." />
          <div className="pp-textarea-field">
            <label htmlFor="bio">Bio</label>
            <textarea id="bio" maxLength={BIO_MAX} value={f.bio} onChange={(e) => setF({ ...f, bio: e.target.value })} />
            <span>{f.bio.length}/{BIO_MAX}</span>
          </div>
          <div className="pp-form-actions">
            <Link to="/profile" className="pp-btn-link pp-btn-link-ghost">Cancel</Link>
            <Button type="submit" loading={saving}>Save changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
