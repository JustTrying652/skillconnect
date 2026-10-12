export type Category = 'barber' | 'hairdresser' | 'tailor' | 'caterer' | 'other';

export interface Provider {
  id: string;
  name: string;
  category: Category;
  bio: string;
  location: string;
  phone?: string;
  photoUrl?: string;
  rating?: number;
  ratingSum?: number;
  reviewCount?: number;
  services: { name: string; price: number }[];
  createdBy: string; // uid
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: 'customer' | 'provider';
}

export interface Connection {
  id: string;
  providerId: string;
  providerName: string;
  customerId: string;
  customerName: string;
  createdAt: number;
}

export interface Review {
  id: string;
  providerId: string;
  customerId: string;
  customerName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: number;
}