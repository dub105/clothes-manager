import { useState } from 'react';
import type { ClothingItem, Outfit } from '../types';

interface Props {
  outfits: Outfit[];
  items: ClothingItem[];
  onDelete: (id: string) => void;
  onBuildClick: () => void;
}

export default function MyOutfitsTab({ outfits, items, onDelete, onBuildClick }: Props) {
  const [viewing, setViewing] = useState<Outfit | null>(null);

  const getItem = (id: string) => items.find((i) => i.id === id);

  if (viewing) {
    const top = viewing.topId ? getItem(viewing.topId) : null;
    const bottom = viewing.bottomId ? getItem(viewing.bottomId) : null;
    const accessories = viewing.accessoryIds.map(getItem).filter(Boolean) as ClothingItem[];

    return (
      <div>
        <button
          onClick={() => setViewing(null)}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-5 text-sm font-medium"
        >
          ← 一覧に戻る
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{viewing.name}</h3>
              {viewing.note && <p className="text-sm text-gray-500 mt-1">{viewing.note}</p>}
              <p className="text-xs text-gray-400 mt-1">
                {new Date(viewing.createdAt).toLocaleDateString('ja-JP', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}
              </p>
            </div>
            <button
              onClick={() => { onDelete(viewing.id); setViewing(null); }}
              className="text-xs text-red-400 hover:text-red-600 transition-colors"
            >
              削除
            </button>
          </div>

          <div className="p-5">
            <div className="flex flex-wrap gap-6 justify-center">
              {top && <OutfitItemCard item={top} label="トップス" />}
              {bottom && <OutfitItemCard item={bottom} label="ボトムス" />}
              {accessories.map((acc) => (
                <OutfitItemCard key={acc.id} item={acc} label="小物" />
              ))}
              {!top && !bottom && accessories.length === 0 && (
                <p className="text-gray-400 text-sm py-8">アイテムが削除されています</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {outfits.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <div className="text-6xl mb-4">✨</div>
          <p className="text-lg font-medium text-gray-500">保存したコーデがありません</p>
          <p className="text-sm mt-1">「コーデを作る」タブで組み合わせを作りましょう</p>
          <button
            onClick={onBuildClick}
            className="mt-5 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors text-sm"
          >
            コーデを作る
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {outfits.map((outfit) => {
            const top = outfit.topId ? getItem(outfit.topId) : null;
            const bottom = outfit.bottomId ? getItem(outfit.bottomId) : null;
            const accessories = outfit.accessoryIds.map(getItem).filter(Boolean) as ClothingItem[];
            const allItems = [top, bottom, ...accessories].filter(Boolean) as ClothingItem[];

            return (
              <div
                key={outfit.id}
                className="clothing-card bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer"
                onClick={() => setViewing(outfit)}
              >
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 flex gap-3 flex-wrap">
                  {allItems.slice(0, 4).map((item) => (
                    <div key={item.id} className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-1 shadow-sm">
                      <img src={item.imageData} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                  ))}
                  {allItems.length === 0 && (
                    <div className="w-full h-16 flex items-center justify-center text-gray-300 text-sm">
                      (アイテムなし)
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-medium text-gray-800 text-sm">{outfit.name}</p>
                  {outfit.note && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{outfit.note}</p>}
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-400">
                      {new Date(outfit.createdAt).toLocaleDateString('ja-JP')}
                    </p>
                    <span className="text-xs text-indigo-500">{allItems.length}点</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function OutfitItemCard({ item, label }: { item: ClothingItem; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-32 h-32 bg-gray-50 rounded-xl flex items-center justify-center p-3 border border-gray-100">
        <img src={item.imageData} alt={item.name} className="w-full h-full object-contain" />
      </div>
      <div className="text-center">
        <p className="text-xs text-indigo-600 font-medium">{label}</p>
        <p className="text-sm text-gray-700 font-medium">{item.name}</p>
      </div>
    </div>
  );
}
