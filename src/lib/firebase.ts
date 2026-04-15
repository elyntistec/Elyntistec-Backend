import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";

// Firebase config (public client config).
const firebaseConfig = {
  apiKey: "AIzaSyDWXnmQtKlrYnUv8lYka9R7OSz6Msrw420",
  authDomain: "elyntistec.firebaseapp.com",
  projectId: "elyntistec",
  storageBucket: "elyntistec.firebasestorage.app",
  messagingSenderId: "739861911875",
  appId: "1:739861911875:web:d6bf8d1b3b8a898c04f7f6",
  measurementId: "G-1SBMQR9K5R",
};

export const firebaseApp = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();

// Optional: Analytics (safe init so it won't break unsupported environments)
export const analytics: Promise<Analytics | null> = isSupported()
  .then((ok) => (ok ? getAnalytics(firebaseApp) : null))
  .catch(() => null);

export async function signInWithGoogle() {
  const res = await signInWithPopup(auth, provider);
  const token = await res.user.getIdToken();

  const user = {
    uid: res.user.uid,
    displayName: res.user.displayName,
    email: res.user.email,
    photoURL: res.user.photoURL,
  };

  try {
    window.localStorage.setItem("auth.token", token);
    window.localStorage.setItem("auth.user", JSON.stringify(user));
  } catch {
    // ignore
  }

  return { user, token };
}

export async function createAccountWithEmail({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (name.trim()) {
    await updateProfile(cred.user, { displayName: name.trim() });
  }
  const token = await cred.user.getIdToken();
  const user = {
    uid: cred.user.uid,
    displayName: cred.user.displayName,
    email: cred.user.email,
    photoURL: cred.user.photoURL,
  };
  try {
    window.localStorage.setItem("auth.token", token);
    window.localStorage.setItem("auth.user", JSON.stringify(user));
  } catch {
    // ignore
  }
  return { user, token };
}

export async function requestPasswordReset(email: string) {
  await sendPasswordResetEmail(auth, email);
}

