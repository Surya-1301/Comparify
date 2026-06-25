
import admin from 'firebase-admin';

if (!admin.apps.length) {
  const svc = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
  admin.initializeApp({ credential: admin.credential.cert(svc) });
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
