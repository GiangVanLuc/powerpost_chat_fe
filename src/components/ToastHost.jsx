import React from 'react';
import { Toast } from '../design-system/index.js';
import { useApp } from '../store/AppStore.jsx';

export default function ToastHost() {
  const { toasts, actions } = useApp();
  return (
    <div className="pp-toasts" aria-live="polite">
      {toasts.map((t) => <Toast key={t.id} tone={t.tone} title={t.title} message={t.message} onClose={() => actions.dismissToast(t.id)} />)}
    </div>
  );
}
