import { Category } from './types';

export const CATEGORIES: { label: Category; icon: string }[] = [
  { label: 'Tools', icon: 'wrench' },
  { label: 'Outdoor', icon: 'trees' },
  { label: 'Sports', icon: 'bike' },
  { label: 'Home', icon: 'home' },
  { label: 'Games', icon: 'gamepad-2' },
  { label: 'Spaces', icon: 'bed' },
  { label: 'Other', icon: 'package' },
];

// Default map center — Springfield, IL
export const DEFAULT_LOCATION = {
  latitude: 39.8097,
  longitude: -89.6440,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export const CATEGORY_LABELS: Category[] = [
  'Tools',
  'Outdoor',
  'Sports',
  'Home',
  'Games',
  'Spaces',
  'Other',
];
