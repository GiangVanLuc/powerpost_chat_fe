import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppLogo, Button, Icon, PasswordField, TextField } from '../design-system/index.js';
import { useApp } from '../store/AppStore.jsx';
import { USE_MOCK } from '../services/config.js';

export default function Login() {
  const { actions } = useApp();
  const nav = useNavigate();
  const loc = useLocation();
  const [form, setForm] = useState({ user: USE_MOCK ? 'minhanh' : '', pass: USE_MOCK ? 'matkhau123' : '' });
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const errs = {
    user: !form.user.trim() ? 'Enter your username or email.' : null,
    pass: !form.pass ? 'Enter your password.' : null
  };
  const show = (k) => (touched[k] || submitted) && errs[k];

  const submit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (errs.user || errs.pass) return;
    setLoading(true); setError(null);
    try {
      await actions.login(form.user.trim(), form.pass);
      nav(loc.state?.from && loc.state.from !== '/login' ? loc.state.from : '/friends', { replace: true });
    } catch (err) {
      if (err.status === 401) setError('Incorrect username or password.');
      else actions.toast('error', "Can't reach the server", 'Check your internet connection and try again.');
      setLoading(false);
    }
  };

  return (
    <main className="pp-auth">
      <div className="pp-auth-col">
        <div className="pp-auth-logo"><AppLogo size={40} /></div>
        <form className="pp-auth-card" onSubmit={submit} noValidate>
          <div>
            <h1 className="pp-display">Welcome back</h1>
            <p className="pp-muted">Sign in to continue to your conversations.</p>
          </div>
          {error && <div className="pp-alert" role="alert"><Icon name="alert" size={16} />{error}</div>}
          <TextField label="Username or email" autoComplete="username" value={form.user} error={show('user') || undefined}
            onChange={(e) => setForm({ ...form, user: e.target.value })} onBlur={() => setTouched({ ...touched, user: true })} />
          <PasswordField label="Password" autoComplete="current-password" value={form.pass} error={show('pass') || undefined}
            onChange={(e) => setForm({ ...form, pass: e.target.value })} onBlur={() => setTouched({ ...touched, pass: true })} />
          <Button type="submit" size="lg" fullWidth loading={loading}>{loading ? 'Signing in…' : 'Sign in'}</Button>
          {USE_MOCK && <p className="pp-hint">Mock mode: any password works, “sai” shows the wrong-credentials state.</p>}
        </form>
        <p className="pp-auth-foot">New here? <Link to="/register">Create an account</Link></p>
      </div>
    </main>
  );
}
