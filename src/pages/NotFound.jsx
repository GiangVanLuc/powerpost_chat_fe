import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, EmptyState } from '../design-system/index.js';

export default function NotFound() {
  const nav = useNavigate();
  return (
    <div className="pp-page"><div className="pp-center">
      <EmptyState icon="compass" title="Page not found" description="This chat or profile doesn’t exist, or you no longer have access." action={<Button variant="secondary" icon="back" onClick={() => nav('/chats')}>Back to chats</Button>} />
    </div></div>
  );
}
