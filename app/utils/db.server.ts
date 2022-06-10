import admin from "firebase-admin";
import type { App, ServiceAccount } from "firebase-admin/app";
import serviceAccount from "../../remix-starter-adminsdk.json";
import {
  applicationDefault,
  initializeApp as initializeAdminApp,
} from "firebase-admin/app";
import { getApps, initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
  signOut,
} from "firebase/auth";

// require("dotenv").config();

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
};

if (!admin.apps.length) {
  initializeAdminApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
    databaseURL: "https://remix-starter.firebaseio.com",
  });
}

const db = admin.firestore();
const adminAuth = admin.auth();
const storage = admin.storage();

let Firebase: App;

if (!getApps().length) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Firebase = initializeApp(firebaseConfig);
}

async function signIn(email: string, password: string) {
  const auth = getAuth();
  return signInWithEmailAndPassword(auth, email, password);
}

async function signUp(email: string, password: string) {
  const auth = getAuth();
  console.log("auth :", auth); //eslint disable line #DEBUG LOG#
  return createUserWithEmailAndPassword(auth, email, password);
}

async function getSessionToken(idToken: string) {
  const decodedToken = await adminAuth.verifyIdToken(idToken);
  if (new Date().getTime() / 1000 - decodedToken.auth_time > 5 * 60) {
    throw new Error("Recent sign in required");
  }
  const twoWeeks = 60 * 60 * 24 * 14 * 1000;
  return adminAuth.createSessionCookie(idToken, { expiresIn: twoWeeks });
}

async function signOutFirebase() {
  await signOut(getAuth());
}

export {
  db,
  adminAuth,
  storage,
  signUp,
  getSessionToken,
  signOutFirebase,
  signIn,
};
