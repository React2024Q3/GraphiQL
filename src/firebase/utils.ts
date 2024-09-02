import { Dispatch, SetStateAction } from 'react';

import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';

import { auth, db } from './config';

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
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, 'users'), {
      uid: user.uid,
      name,
      email,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      throw error;
    } else {
      throw new Error('An unknown error occurred');
    }
  }
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
      setName(data.name);
    }
  }
};

export { logInWithEmailAndPassword, registerWithEmailAndPassword, logout, fetchUserName };
