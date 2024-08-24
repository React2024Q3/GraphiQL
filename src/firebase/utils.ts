import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth /* , db */ } from './config';
// import { addDoc, collection } from 'firebase/firestore';

const logInWithEmailAndPassword: (email: string, password: string) => void = async (
  email,
  password
) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
  }
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
  //   const user = res.user;
  //   await addDoc(collection(db, 'users'), {
  //     uid: user.uid,
  //     name,
  //     authProvider: 'local',
  //     email,
  //   });
};

const logout = () => {
  signOut(auth);
};

export { logInWithEmailAndPassword, registerWithEmailAndPassword, logout };
