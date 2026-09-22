export type Category = 'barber' | 'hairdresser' | 'tailor' | 'caterer' | 'other';

export interface Provider {
  id: string;
  name: string;
  category: Category;
  bio: string;
  location: string;
  photoUrl?: string;
  rating?: number;
  services: { name: string; price: number }[];
  createdBy: string; // uid
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: 'customer' | 'provider';
}