import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppLogo, Button, PasswordField, TextField } from '../design-system/index.js';
import { useApp } from '../store/AppStore.jsx';

const USERNAME_RE = /^[a-z0-9_]{3,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASS_RE = /^(?=.*\d).{8,}$/;

export default function Register() {
  const { actions } = useApp();
  const nav = useNavigate();
  const [f, setF] = useState({ displayName: '', username: '', email: '', password: '', confirm: '' });
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [server, setServer] = useState({});
  const [loading, setLoading] = useState(false);

  const errs = {
    displayName: !f.displayName.trim() ? 'Enter a display name.' : null,
    username: !USERNAME_RE.test(f.username) ? '3–20 characters: lowercase letters, numbers and _.' : server.username,
    email: !EMAIL_RE.test(f.email) ? 'Enter a valid email.' : server.email,
    password: !PASS_RE.test(f.password) ? 'Use at least 8 characters, including a number.' : null,
    confirm: f.confirm !== f.password ? 'Passwords do not match.' : null
  };
  const show = (k) => ((touched[k] || submitted) && errs[k]) || undefined;
  const field = (k) => ({
    value: f[k], error: show(k),
    onChange: (e) => { setF({ ...f, [k]: e.target.value }); if (server[k]) setServer({ ...server, [k]: null }); },
    onBlur: () => setTouched({ ...touched, [k]: true })
  });

  const submit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.values(errs).some(Boolean)) return;
    setLoading(true);
    try {
      await actions.register({ displayName: f.displayName.trim(), username: f.username, email: f.email.trim(), password: f.password });
      nav('/friends', { replace: true });
    } catch (err) {
      if (err.field) setServer({ [err.field]: err.message });
      else actions.toast('error', "Couldn't create your account", err.message);
      setLoading(false);
    }
  };

  return (
    <main className="pp-auth">
      <div className="pp-auth-col pp-auth-wide">
        <div className="pp-auth-logo"><AppLogo size={40} /></div>
        <form className="pp-auth-card" onSubmit={submit} noValidate>
          <div>
            <h1 className="pp-display">Create your account</h1>
            <p className="pp-muted">Message and call your friends in real time.</p>
          </div>
          <TextField label="Display name" autoComplete="name" help="Shown to your friends. You can change it later." {...field('displayName')} />
          <div className="pp-grid-2">
            <TextField label="Username" autoComplete="username" help={show('username') ? undefined : 'Letters, numbers and _ only.'} {...field('username')} />
            <TextField label="Email" type="email" autoComplete="email" {...field('email')} />
          </div>
          <PasswordField label="Password" autoComplete="new-password" help={show('password') ? undefined : 'At least 8 characters, including a number.'} {...field('password')} />
          <PasswordField label="Confirm password" autoComplete="new-password" {...field('confirm')} />
          <Button type="submit" size="lg" fullWidth loading={loading}>{loading ? 'Creating account…' : 'Create account'}</Button>
        </form>
        <p className="pp-auth-foot">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </main>
  );
}
