import React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useApp } from './store/AppStore.jsx';
import AppShell from './components/AppShell.jsx';
import CallLayer from './components/CallLayer.jsx';
import ToastHost from './components/ToastHost.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ChatsPage from './pages/ChatsPage.jsx';
import FriendsPage from './pages/FriendsPage.jsx';
import CallsPage from './pages/CallsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import EditProfilePage from './pages/EditProfilePage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import NotFound from './pages/NotFound.jsx';
import { Skeleton } from './design-system/index.js';

function RequireAuth({ children }) {
  const { user, booting } = useApp();
  const loc = useLocation();
  if (booting) return <div className="pp-boot" aria-busy="true"><Skeleton variant="conversation" /><Skeleton variant="conversation" /></div>;
  if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  return children;
}

function GuestOnly({ children }) {
  const { user, booting } = useApp();
  if (booting) return null;
  return user ? <Navigate to="/friends" replace /> : children;
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
        <Route path="/register" element={<GuestOnly><Register /></GuestOnly>} />
        <Route element={<RequireAuth><AppShell /></RequireAuth>}>
          <Route index element={<Navigate to="/chats" replace />} />
          <Route path="chats" element={<ChatsPage />} />
          <Route path="chats/:username" element={<ChatsPage />} />
          <Route path="friends" element={<FriendsPage />} />
          <Route path="friends/:tab" element={<FriendsPage />} />
          <Route path="calls" element={<CallsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="profile/edit" element={<EditProfilePage />} />
          <Route path="users/:username" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <CallLayer />
      <ToastHost />
    </>
  );
}
