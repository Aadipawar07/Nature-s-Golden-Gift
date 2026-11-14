import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

let firebaseAppPromise;

export async function getFirebaseApp() {
  if (getApps().length > 0) return getApps()[0];
  if (!firebaseAppPromise) {
    firebaseAppPromise = import('./env.js').then(({ env }) => {
      if (getApps().length > 0) return getApps()[0];
      return initializeApp({
        credential: cert({
          projectId: env.FIREBASE_PROJECT_ID,
          clientEmail: env.FIREBASE_CLIENT_EMAIL,
          privateKey: env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    });
  }
  return firebaseAppPromise;
}

export async function verifyIdToken(token) {
  const app = await getFirebaseApp();
  return getAuth(app).verifyIdToken(token);
}
