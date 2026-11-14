import { setTokenProvider } from '../api/client';
import { syncAuthUser } from '../api/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let servicesPromise;

async function getFirebaseServices() {
  if (!servicesPromise) {
    servicesPromise = Promise.all([
      import('firebase/app'),
      import('firebase/auth'),
    ]).then(([appSdk, authSdk]) => {
      if (
        !firebaseConfig.apiKey ||
        !firebaseConfig.authDomain ||
        !firebaseConfig.projectId
      ) {
        throw new Error(
          'Firebase auth configuration is incomplete. Set VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, and VITE_FIREBASE_PROJECT_ID.',
        );
      }
      const app = appSdk.getApps()[0] || appSdk.initializeApp(firebaseConfig);
      return { auth: authSdk.getAuth(app), authSdk };
    });
  }
  return servicesPromise;
}

setTokenProvider(getIdToken);

export async function subscribeToAuth(onUser) {
  const { auth, authSdk } = await getFirebaseServices();
  return authSdk.onAuthStateChanged(auth, onUser);
}

export async function getIdToken() {
  const { auth } = await getFirebaseServices();
  return auth.currentUser ? auth.currentUser.getIdToken() : null;
}

async function syncSignedInUser(user) {
  await syncAuthUser(user.displayName);
  return user;
}

export async function login(email, password) {
  const { auth, authSdk } = await getFirebaseServices();
  const credential = await authSdk.signInWithEmailAndPassword(
    auth,
    email,
    password,
  );
  return syncSignedInUser(credential.user);
}

export async function register(name, email, password) {
  const { auth, authSdk } = await getFirebaseServices();
  const credential = await authSdk.createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );
  await authSdk.updateProfile(credential.user, { displayName: name });
  await syncAuthUser(name);
  try {
    await authSdk.sendEmailVerification(credential.user);
    return { user: credential.user, verificationSent: true };
  } catch {
    return { user: credential.user, verificationSent: false };
  }
}

export async function loginWithGoogle() {
  const { auth, authSdk } = await getFirebaseServices();
  const provider = new authSdk.GoogleAuthProvider();
  const credential = await authSdk.signInWithPopup(auth, provider);
  return syncSignedInUser(credential.user);
}

export async function logout() {
  const { auth, authSdk } = await getFirebaseServices();
  await authSdk.signOut(auth);
  localStorage.removeItem('ngg.session');
}

export async function resetPassword(email) {
  const { auth, authSdk } = await getFirebaseServices();
  await authSdk.sendPasswordResetEmail(auth, email);
}
