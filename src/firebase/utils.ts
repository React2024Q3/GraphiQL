import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from './config';

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
  await updateProfile(user, {
    displayName: name,
  });
};

const logout = () => {
  signOut(auth);
};

export { logInWithEmailAndPassword, registerWithEmailAndPassword, logout };
