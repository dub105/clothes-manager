import type { ClothingItem, Outfit } from './types';

const CLOTHING_KEY = 'clothes_manager_items';
const OUTFITS_KEY = 'clothes_manager_outfits';

export function loadClothingItems(): ClothingItem[] {
  try {
    const raw = localStorage.getItem(CLOTHING_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveClothingItems(items: ClothingItem[]): void {
  localStorage.setItem(CLOTHING_KEY, JSON.stringify(items));
}

export function loadOutfits(): Outfit[] {
  try {
    const raw = localStorage.getItem(OUTFITS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveOutfits(outfits: Outfit[]): void {
  localStorage.setItem(OUTFITS_KEY, JSON.stringify(outfits));
}
