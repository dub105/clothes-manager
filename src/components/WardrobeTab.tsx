import { useState } from 'react';
import type { ClothingCategory, ClothingItem } from '../types';
import { CATEGORY_LABELS, CATEGORY_ICONS } from '../types';
import ClothingCard from './ClothingCard';

interface Props {
  items: ClothingItem[];
  onDelete: (id: string) => void;
  onAddClick: () => void;
}

const ALL = 'all' as const;
type Filter = ClothingCategory | typeof ALL;

export default function WardrobeTab({ items, onDelete, onAddClick }: Props) {
  const [filter, setFilter] = useState<Filter>(ALL);

  const filtered = filter === ALL ? items : items.filter((i) => i.category === filter);

  const categories: { value: Filter; label: string; icon: string }[] = [
    { value: ALL, label: 'すべて', icon: '👗' },
    { value: 'top', label: CATEGORY_LABELS.top, icon: CATEGORY_ICONS.top },
    { value: 'bottom', label: CATEGORY_LABELS.bottom, icon: CATEGORY_ICONS.bottom },
    { value: 'accessory', label: CATEGORY_LABELS.accessory, icon: CATEGORY_ICONS.accessory },
  ];

  return (
    <div>
      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-5">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setFilter(cat.value)}
            className={`category-chip flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
              filter === cat.value
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
            <span className={`text-xs ml-0.5 ${filter === cat.value ? 'text-indigo-200' : 'text-gray-400'}`}>
              {cat.value === ALL ? items.length : items.filter((i) => i.category === cat.value).length}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <div className="text-6xl mb-4">👔</div>
          <p className="text-lg font-medium text-gray-500">服がまだありません</p>
          <p className="text-sm mt-1">右上の「＋ 追加」ボタンから服を追加しましょう</p>
          <button
            onClick={onAddClick}
            className="mt-5 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors text-sm"
          >
            最初の服を追加する
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <ClothingCard key={item.id} item={item} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
