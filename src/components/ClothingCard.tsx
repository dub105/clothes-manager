import type { ClothingItem } from '../types';
import { CATEGORY_LABELS } from '../types';

interface Props {
  item: ClothingItem;
  onDelete?: (id: string) => void;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (item: ClothingItem) => void;
  compact?: boolean;
}

export default function ClothingCard({ item, onDelete, selectable, selected, onSelect, compact }: Props) {
  const handleClick = () => {
    if (selectable && onSelect) onSelect(item);
  };

  return (
    <div
      className={`clothing-card bg-white rounded-2xl overflow-hidden shadow-sm border-2 transition-all
        ${selectable ? 'cursor-pointer select-ring' : ''}
        ${selected ? 'selected-item border-indigo-500' : 'border-transparent'}
      `}
      onClick={handleClick}
    >
      <div className={`relative bg-gray-50 ${compact ? 'h-32' : 'h-44'}`}>
        <img
          src={item.imageData}
          alt={item.name}
          className="w-full h-full object-contain p-2"
        />
        {selected && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">✓</span>
          </div>
        )}
        {onDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
            className="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full text-sm flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ opacity: undefined }}
            title="削除"
          >
            ×
          </button>
        )}
      </div>
      <div className={`${compact ? 'p-2' : 'p-3'}`}>
        <p className={`font-medium text-gray-800 truncate ${compact ? 'text-xs' : 'text-sm'}`}>{item.name}</p>
        {!compact && (
          <>
            <p className="text-xs text-gray-400 mt-0.5">{CATEGORY_LABELS[item.category]}</p>
            {item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {item.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      {onDelete && (
        <div className="px-3 pb-3">
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
            className="text-xs text-red-400 hover:text-red-600 transition-colors"
          >
            削除
          </button>
        </div>
      )}
    </div>
  );
}
