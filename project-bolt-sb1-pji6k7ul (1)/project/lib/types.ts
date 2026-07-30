export type ListingType = 'lend' | 'borrow';

export type Category =
  | 'Tools'
  | 'Outdoor'
  | 'Sports'
  | 'Home'
  | 'Games'
  | 'Spaces'
  | 'Other';

export interface Item {
  id: string;
  title: string;
  description: string;
  category: Category;
  listing_type: ListingType;
  image_url: string;
  house_photo_url: string;
  lender_name: string;
  address: string;
  latitude: number;
  longitude: number;
  borrow_duration_days: number | null;
  created_at: string;
}

export interface ItemInput {
  title: string;
  description: string;
  category: Category;
  listing_type: ListingType;
  image_url: string;
  house_photo_url: string;
  lender_name: string;
  address: string;
  latitude: number;
  longitude: number;
  borrow_duration_days?: number | null;
}
