import { Provider } from '../types';

export function getRating(p: Pick<Provider, 'ratingSum' | 'reviewCount'>): number | null {
  if (!p.reviewCount || !p.ratingSum) return null;
  return p.ratingSum / p.reviewCount;
}