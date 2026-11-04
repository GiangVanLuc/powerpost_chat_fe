// Seed data for mock mode. Vietnamese names and short natural messages, no lorem ipsum.
const now = Date.now();
const min = 60 * 1000, hour = 60 * min, day = 24 * hour;
export const iso = (msAgo) => new Date(now - msAgo).toISOString();

export const ME = {
  id: 'u0', username: 'duycuong', displayName: 'Duy Cường', email: 'duycuong@example.com',
  bio: 'Backend dev · đang làm đồ án realtime chat với Spring Boot và WebRTC.', avatarUrl: '', createdAt: '2026-09-01T00:00:00Z'
};

export const USERS = {
  minhanh: { id: 'u1', username: 'minhanh', displayName: 'Minh Anh', bio: 'Frontend + UI. Thích cà phê muối và những cuộc gọi ngắn gọn.', presence: 'online' },
  hoangnam: { id: 'u2', username: 'hoangnam', displayName: 'Hoàng Nam', bio: 'Java / Spring Boot.', presence: 'online' },
  thuha: { id: 'u3', username: 'thuha', displayName: 'Thu Hà', bio: 'QA & tester của nhóm.', presence: 'in-call' },
  duclong: { id: 'u4', username: 'duclong', displayName: 'Đức Long', bio: 'DevOps, thích Docker.', presence: 'offline', lastSeen: iso(2 * hour) },
  lanphuong: { id: 'u5', username: 'lanphuong', displayName: 'Lan Phương', bio: 'Làm slide giỏi nhất nhóm.', presence: 'online' },
  quanghuy: { id: 'u6', username: 'quanghuy', displayName: 'Quang Huy', bio: '', presence: 'offline', lastSeen: iso(day) },
  halinh: { id: 'u7', username: 'halinh', displayName: 'Hà Linh', bio: '', presence: 'online' },
  hamy: { id: 'u8', username: 'hamy', displayName: 'Hà My', bio: '', presence: 'offline', lastSeen: iso(5 * min) },
  haidang: { id: 'u9', username: 'haidang', displayName: 'Hải Đăng', bio: '', presence: 'offline', lastSeen: iso(hour) },
  hanhnguyen: { id: 'u10', username: 'hanhnguyen', displayName: 'Hạnh Nguyên', bio: '', presence: 'online' }
};

export const FRIENDS = ['minhanh', 'hoangnam', 'thuha', 'duclong', 'lanphuong', 'quanghuy'];

export const REQUESTS = {
  incoming: [{ id: 'r1', user: 'hamy', createdAt: iso(5 * min) }],
  outgoing: [{ id: 'r2', user: 'haidang', createdAt: iso(day) }]
};

let mid = 0;
const m = (peer, dir, text, msAgo, status) => ({ id: 'm' + (++mid), peer, from: dir === 'out' ? ME.username : peer, text, createdAt: iso(msAgo), status: dir === 'out' ? (status || 'read') : undefined });

export const MESSAGES = {
  minhanh: [
    m('minhanh', 'in', 'Mai nhóm mình demo phần call lúc mấy giờ?', day + 3 * hour),
    m('minhanh', 'out', 'Chắc 8h tối, sau khi mình fix xong TURN server', day + 3 * hour - 4 * min),
    m('minhanh', 'in', 'Ok, mình chuẩn bị slide phần signaling', day + 2 * hour),
    m('minhanh', 'out', 'Fix xong rồi nhé, đã test qua 4G', 25 * min),
    m('minhanh', 'in', 'Ngon! Mình vừa gọi thử từ nhà, hình rất nét', 14 * min),
    m('minhanh', 'in', 'Tối nay 8h gọi nhé?', 12 * min)
  ],
  hoangnam: [
    m('hoangnam', 'in', 'Bạn đã xem lại phần WebSocket handshake chưa?', day + 30 * min),
    m('hoangnam', 'in', 'Mình thấy reconnect đang bị lặp hai lần', day + 30 * min),
    m('hoangnam', 'out', 'Để mai mình xem, chắc do chưa clear timer khi onclose', day + 10 * min),
    m('hoangnam', 'out', 'Fix rồi nhé, thêm backoff 1s → 2s → 4s', 40 * min),
    m('hoangnam', 'in', 'Ok, để mình push code lên', 30 * min)
  ],
  thuha: [m('thuha', 'out', 'Gọi lại cho mình khi xong nhé', 45 * min, 'delivered')],
  duclong: [m('duclong', 'in', 'Ảnh chụp màn hình lỗi CORS đây', 2 * hour)],
  lanphuong: [m('lanphuong', 'in', 'Gửi mình slide phần WebRTC nha', day + 2 * hour)],
  quanghuy: [m('quanghuy', 'out', 'Cảm ơn bạn nhiều!', 3 * day, 'delivered')]
};

export const UNREAD = { minhanh: 2, lanphuong: 1 };

export const CALLS = [
  { id: 'c1', peer: 'thuha', direction: 'incoming', media: 'voice', status: 'missed', startedAt: iso(3 * hour) },
  { id: 'c2', peer: 'minhanh', direction: 'outgoing', media: 'video', status: 'completed', startedAt: iso(day), duration: 768 },
  { id: 'c3', peer: 'hoangnam', direction: 'incoming', media: 'voice', status: 'completed', startedAt: iso(day + 2 * hour), duration: 185 },
  { id: 'c4', peer: 'duclong', direction: 'outgoing', media: 'video', status: 'rejected', startedAt: iso(2 * day) },
  { id: 'c5', peer: 'lanphuong', direction: 'outgoing', media: 'voice', status: 'failed', startedAt: iso(4 * day) }
];

export const NOTIFICATIONS = [
  { id: 'n1', type: 'friend-request', from: 'hamy', requestId: 'r1', text: 'sent you a friend request', createdAt: iso(5 * min), read: false },
  { id: 'n2', type: 'missed-call', from: 'thuha', text: 'missed voice call', createdAt: iso(3 * hour), read: false },
  { id: 'n3', type: 'message', from: 'minhanh', text: 'sent you 2 new messages', createdAt: iso(12 * min), read: true }
];
