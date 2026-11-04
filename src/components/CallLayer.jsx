import React from 'react';
import { CallStage, IncomingCall, Modal, Button } from '../design-system/index.js';
import { useApp } from '../store/AppStore.jsx';
import { timer, duration } from '../utils/format.js';
import { RING_TIMEOUT_SEC } from '../services/config.js';

const PERMISSION = {
  'camera-denied': { icon: 'video-off', title: 'Camera access is blocked', desc: 'PowerPost needs your camera for video calls. Your microphone still works, so you can join with audio only.', how: 'Allow camera in your browser’s site settings', step: 'Set Camera to “Allow” for this site.', audio: true },
  'microphone-denied': { icon: 'mic-off', title: 'Microphone access is blocked', desc: 'Calls need your microphone. The other person can’t hear you without it.', how: 'Allow microphone in your browser’s site settings', step: 'Set Microphone to “Allow” for this site.', audio: false },
  'device-not-found': { icon: 'video-off', title: 'No camera or microphone found', desc: 'We couldn’t find a device to use. Plug one in, or continue with audio only.', how: 'Check your devices', step: 'Make sure no other app is using them, then reconnect.', audio: true }
};

/** Global call UI: incoming overlay, full-screen call surface, media permission errors. */
export default function CallLayer() {
  const { call, permission, users, user, actions } = useApp();
  const peerName = call ? users[call.peer]?.displayName || call.peer : '';

  if (permission) {
    const p = PERMISSION[permission.case];
    return (
      <Modal tone="danger" icon={p.icon} title={p.title} description={p.desc} onClose={actions.cancelPermission}
        actions={<>
          <Button variant="ghost" onClick={actions.cancelPermission}>Cancel</Button>
          {p.audio && permission.media === 'video' && <Button variant="secondary" icon="phone" onClick={actions.continueAudioOnly}>Continue audio-only</Button>}
          <Button icon="retry" onClick={actions.retryPermission}>Retry</Button>
        </>}>
        <div className="pp-howto"><strong>{p.how}</strong><span>1. Click the lock icon next to the address bar.</span><span>2. {p.step}</span><span>3. Come back and press Retry.</span></div>
      </Modal>
    );
  }
  if (!call) return null;

  if (call.phase === 'incoming') {
    return <IncomingCall overlay name={peerName} username={call.peer} media={call.media} timeoutSec={RING_TIMEOUT_SEC} onAccept={actions.acceptCall} onReject={actions.rejectCall} />;
  }

  return (
    <div className="pp-call" role="dialog" aria-modal="true">
      <CallStage media={call.media} state={call.phase} name={peerName} selfName={user?.displayName}
        duration={timer(call.secs)} summary={call.secs ? `Duration ${duration(call.secs)}` : undefined}
        micOn={call.micOn} camOn={call.camOn} remoteMuted={false}
        localStream={call.localStream} remoteStream={call.remoteStream}
        onToggleMic={actions.toggleMic} onToggleCamera={actions.toggleCam} onEnd={actions.endCall} />
    </div>
  );
}
