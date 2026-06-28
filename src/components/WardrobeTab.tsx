import { useState, useMemo } from 'react';
import type { ClothingCategory, ClothingItem } from '../types';
import { CATEGORY_LABELS, CATEGORY_ICONS } from '../types';
import ClothingCard from './ClothingCard';

interface Props {
  items: ClothingItem[];
  onDelete: (id: string) => void;
  onAddClick: () => void;
}

const ALL = 'all' as const;
type CategoryFilter = ClothingCategory | typeof ALL;

export default function WardrobeTab({ items, onDelete, onAddClick }: Props) {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>(ALL);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  const categoryFiltered = categoryFilter === ALL
    ? items
    : items.filter((i) => i.category === categoryFilter);

  // Collect all tags from category-filtered items
  const availableTags = useMemo(() => {
    const tagCounts = new Map<string, number>();
    categoryFiltered.forEach((item) => {
      item.tags.forEach((tag) => {
        tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
      });
    });
    return Array.from(tagCounts.entries()).sort((a, b) => b[1] - a[1]);
  }, [categoryFiltered]);

  const filtered = selectedTags.size === 0
    ? categoryFiltered
    : categoryFiltered.filter((item) =>
        [...selectedTags].every((tag) => item.tags.includes(tag))
      );

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }
      return next;
    });
  };

  const handleCategoryChange = (cat: CategoryFilter) => {
    setCategoryFilter(cat);
    setSelectedTags(new Set());
  };

  const categories: { value: CategoryFilter; label: string; icon: string }[] = [
    { value: ALL, label: 'すべて', icon: '👗' },
    { value: 'top', label: CATEGORY_LABELS.top, icon: CATEGORY_ICONS.top },
    { value: 'bottom', label: CATEGORY_LABELS.bottom, icon: CATEGORY_ICONS.bottom },
    { value: 'accessory', label: CATEGORY_LABELS.accessory, icon: CATEGORY_ICONS.accessory },
  ];

  return (
    <div>
      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-3">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => handleCategoryChange(cat.value)}
            className={`category-chip flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
              categoryFilter === cat.value
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
            <span className={`text-xs ml-0.5 ${categoryFilter === cat.value ? 'text-indigo-200' : 'text-gray-400'}`}>
              {cat.value === ALL ? items.length : items.filter((i) => i.category === cat.value).length}
            </span>
          </button>
        ))}
      </div>

      {/* Tag filter */}
      {availableTags.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-500">🏷️ タグで絞り込む</span>
            {selectedTags.size > 0 && (
              <button
                onClick={() => setSelectedTags(new Set())}
                className="text-xs text-indigo-500 hover:text-indigo-700 underline"
              >
                クリア
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {availableTags.map(([tag, count]) => {
              const active = selectedTags.has(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm border transition-all ${
                    active
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <span>{tag}</span>
                  <span className={`text-xs ${active ? 'text-indigo-200' : 'text-gray-400'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Result count when filtering */}
      {selectedTags.size > 0 && (
        <p className="text-xs text-gray-400 mb-3">
          {filtered.length} 件 / {categoryFiltered.length} 件中
        </p>
      )}

      {items.length === 0 ? (
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
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-base font-medium text-gray-500">該当する服がありません</p>
          <button
            onClick={() => setSelectedTags(new Set())}
            className="mt-3 text-sm text-indigo-500 hover:underline"
          >
            タグフィルターをクリア
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
