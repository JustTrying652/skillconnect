import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { UserProfile } from '../types';

export async function signUp(name: string, email: string, password: string, role: 'customer' | 'provider') {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: name });

  const profile: UserProfile = { uid: cred.user.uid, name, email, role };
  await setDoc(doc(db, 'users', cred.user.uid), profile);

  return cred.user;
}

export async function login(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function logout() {
  await signOut(auth);
}