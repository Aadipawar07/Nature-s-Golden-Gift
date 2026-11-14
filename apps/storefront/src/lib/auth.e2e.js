import { setTokenProvider } from '../api/client';
import { syncAuthUser } from '../api/auth';

const fakeAuthToken = 'NGG_E2E_FAKE_AUTH_TOKEN';
const listeners = new Set();
let currentUser =
  localStorage.getItem('ngg.session') === '1'
    ? {
        uid: 'e2e-user',
        email: 'e2e@example.test',
        displayName: 'E2E User',
      }
    : null;

setTokenProvider(getIdToken);

function publish(user) {
  currentUser = user;
  for (const listener of listeners) listener(user);
}

async function completeSignIn(user) {
  publish(user);
  await syncAuthUser(user.displayName);
  return user;
}

export async function subscribeToAuth(onUser) {
  listeners.add(onUser);
  onUser(currentUser);
  return () => listeners.delete(onUser);
}

export async function getIdToken() {
  return currentUser ? fakeAuthToken : null;
}

export async function login(email) {
  return completeSignIn({ uid: 'e2e-user', email, displayName: 'E2E User' });
}

export async function register(name, email) {
  const user = await completeSignIn({
    uid: 'e2e-user',
    email,
    displayName: name,
  });
  return { user, verificationSent: true };
}

export async function loginWithGoogle() {
  return completeSignIn({
    uid: 'e2e-user',
    email: 'e2e@example.test',
    displayName: 'E2E User',
  });
}

export async function logout() {
  publish(null);
}

export async function resetPassword() {}
