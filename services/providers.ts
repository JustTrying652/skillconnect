import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Provider, Category, Connection } from '../types';

export async function getProviders(): Promise<Provider[]> {
  const snap = await getDocs(collection(db, 'providers'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Provider));
}

export async function getProvidersByCategory(category: Category): Promise<Provider[]> {
  const q = query(collection(db, 'providers'), where('category', '==', category));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Provider));
}

export async function createProvider(data: Omit<Provider, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'providers'), data);
  return ref.id;
}

export async function logConnection(data: Omit<Connection, 'id' | 'createdAt'>) {
  await addDoc(collection(db, 'connections'), {
    ...data,
    createdAt: Date.now(),
  });
}