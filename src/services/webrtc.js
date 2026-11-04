import { ICE_SERVERS } from './config.js';
import { socket } from './socket.js';

/** Map getUserMedia errors to the three cases the UI explains. */
export function mediaErrorKind(err) {
  const n = err && err.name;
  if (n === 'NotFoundError' || n === 'OverconstrainedError' || n === 'DevicesNotFoundError') return 'device-not-found';
  return 'denied';
}

/**
 * Ask for camera/mic. Returns { stream, error } where error is
 * 'camera-denied' | 'microphone-denied' | 'device-not-found' | null.
 * For video, if only the camera fails, we retry audio-only so the UI can offer “Continue audio-only”.
 */
export async function getMedia(media) {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return { stream: null, error: 'device-not-found' };
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: media === 'video' });
    return { stream, error: null };
  } catch (err) {
    if (media === 'video') {
      try {
        const audioOnly = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioOnly.getTracks().forEach((t) => t.stop());
        return { stream: null, error: mediaErrorKind(err) === 'device-not-found' ? 'device-not-found' : 'camera-denied' };
      } catch (e2) { /* mic also failed */ }
    }
    return { stream: null, error: mediaErrorKind(err) === 'device-not-found' ? 'device-not-found' : 'microphone-denied' };
  }
}

/**
 * One 1-1 peer connection. Signaling goes through the realtime socket.
 * Usage (caller):  const pc = new PeerCall({ callId, peer, localStream, onRemoteStream }); await pc.call();
 * Usage (callee):  pc = new PeerCall(...); — the offer arrives via socket 'rtc.offer' and is answered automatically.
 */
export class PeerCall {
  constructor({ callId, peer, localStream, onRemoteStream, onStateChange }) {
    this.callId = callId;
    this.peer = peer;
    this.pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    this.remote = new MediaStream();
    if (localStream) localStream.getTracks().forEach((t) => this.pc.addTrack(t, localStream));
    this.pc.ontrack = (e) => { e.streams[0].getTracks().forEach((t) => this.remote.addTrack(t)); onRemoteStream && onRemoteStream(this.remote); };
    this.pc.onicecandidate = (e) => { if (e.candidate) socket.send('rtc.ice', { callId, to: peer, payload: e.candidate }); };
    this.pc.onconnectionstatechange = () => onStateChange && onStateChange(this.pc.connectionState); // connected | disconnected | failed
    this.off = [
      socket.on('rtc.offer', (d) => d.callId === callId && this.answer(d.payload)),
      socket.on('rtc.answer', (d) => d.callId === callId && this.pc.setRemoteDescription(d.payload)),
      socket.on('rtc.ice', (d) => d.callId === callId && this.pc.addIceCandidate(d.payload).catch(() => {}))
    ];
  }

  async call() {
    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);
    socket.send('rtc.offer', { callId: this.callId, to: this.peer, payload: offer });
  }

  async answer(offer) {
    await this.pc.setRemoteDescription(offer);
    const answer = await this.pc.createAnswer();
    await this.pc.setLocalDescription(answer);
    socket.send('rtc.answer', { callId: this.callId, to: this.peer, payload: answer });
  }

  setTrackEnabled(kind, enabled) {
    this.pc.getSenders().forEach((s) => { if (s.track && s.track.kind === kind) s.track.enabled = enabled; });
  }

  close() {
    this.off.forEach((f) => f());
    this.pc.getSenders().forEach((s) => s.track && s.track.stop());
    this.pc.close();
  }
}

export function stopStream(stream) { if (stream) stream.getTracks().forEach((t) => t.stop()); }
