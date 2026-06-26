export type ClothingCategory = 'top' | 'bottom' | 'accessory';

export interface ClothingItem {
  id: string;
  name: string;
  category: ClothingCategory;
  imageData: string; // base64
  color?: string;
  tags: string[];
  createdAt: string;
}

export interface Outfit {
  id: string;
  name: string;
  topId?: string;
  bottomId?: string;
  accessoryIds: string[];
  note?: string;
  createdAt: string;
}

export const CATEGORY_LABELS: Record<ClothingCategory, string> = {
  top: 'トップス',
  bottom: 'ボトムス',
  accessory: '小物・アクセサリー',
};

export const CATEGORY_ICONS: Record<ClothingCategory, string> = {
  top: '👕',
  bottom: '👖',
  accessory: '🎩',
};
