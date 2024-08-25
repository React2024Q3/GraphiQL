import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import { auth, db } from './config';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { Dispatch, SetStateAction } from 'react';

const logInWithEmailAndPassword: (email: string, password: string) => void = async (
  email,
  password
) => {
  await signInWithEmailAndPassword(auth, email, password);
};

const registerWithEmailAndPassword: (
  name: string,
  email: string,
  password: string
) => void = async (name, email, password) => {
  const res = await createUserWithEmailAndPassword(auth, email, password);
  const user = res.user;
  await addDoc(collection(db, 'users'), {
    uid: user.uid,
    name,
    email,
  });
};

const logout = () => {
  signOut(auth);
};

const fetchUserName = async (
  user: User | null | undefined,
  setName: Dispatch<SetStateAction<string>>
) => {
  const userId = user?.uid;
  if (userId) {
    const q = query(collection(db, 'users'), where('uid', '==', userId));
    const doc = await getDocs(q);
    if (!doc.empty) {
      const data = doc.docs[0].data();
      console.log('data', data);
      setName(data.name);
    }
  }
};

export { logInWithEmailAndPassword, registerWithEmailAndPassword, logout, fetchUserName };
