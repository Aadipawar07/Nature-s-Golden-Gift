import { useSyncExternalStore } from 'react';

export const SESSION_HINT_CHANGE_EVENT = 'ngg-session-hint-change';

function getSnapshot() {
  return localStorage.getItem('ngg.session') === '1';
}

function subscribe(callback) {
  window.addEventListener(SESSION_HINT_CHANGE_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(SESSION_HINT_CHANGE_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

export default function useSessionHint() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
