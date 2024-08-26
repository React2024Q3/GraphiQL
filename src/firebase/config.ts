import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyD9dOtoYmgb3fECgDbiET38_c2NbYErs1k',
  authDomain: 'graphiql-app-99f83.firebaseapp.com',
  projectId: 'graphiql-app-99f83',
  storageBucket: 'graphiql-app-99f83.appspot.com',
  messagingSenderId: '438390752470',
  appId: '1:438390752470:web:09495df74d20dbec137577',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
