import { io } from 'socket.io-client';

let socket = null;

export function getSocket() {
  if (!socket) {
    socket = io(import.meta.env.VITE_SERVER_URL || 'http://localhost:3001', {
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
    });
  }
  return socket;
}

export function destroySocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
