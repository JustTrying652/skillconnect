import { collection, doc, getDocs, query, where, runTransaction } from 'firebase/firestore';
import { db } from './firebase';
import { Review } from '../types';

export async function getReviews(providerId: string): Promise<Review[]> {
  const q = query(collection(db, 'reviews'), where('providerId', '==', providerId));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as Review))
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function submitReview(input: Omit<Review, 'id' | 'createdAt'>) {
  const reviewRef = doc(db, 'reviews', `${input.providerId}_${input.customerId}`);
  const providerRef = doc(db, 'providers', input.providerId);

  await runTransaction(db, async (tx) => {
    const existing = await tx.get(reviewRef);
    if (existing.exists()) throw new Error('already-reviewed');

    const providerSnap = await tx.get(providerRef);
    if (!providerSnap.exists()) throw new Error('not-found');
    const data = providerSnap.data();

    tx.set(reviewRef, { ...input, createdAt: Date.now() });
    tx.update(providerRef, {
      ratingSum: (data.ratingSum ?? 0) + input.rating,
      reviewCount: (data.reviewCount ?? 0) + 1,
    });
  });
}