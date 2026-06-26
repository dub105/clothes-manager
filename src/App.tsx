import { useState } from 'react';
import type { ClothingItem, Outfit } from './types';
import {
  loadClothingItems, saveClothingItems,
  loadOutfits, saveOutfits
} from './storage';
import AddClothingModal from './components/AddClothingModal';
import WardrobeTab from './components/WardrobeTab';
import OutfitBuilderTab from './components/OutfitBuilderTab';
import MyOutfitsTab from './components/MyOutfitsTab';

type Tab = 'wardrobe' | 'builder' | 'outfits';

const tabs: { key: Tab; label: string; icon: string }[] = [
  { key: 'wardrobe', label: 'マイワードローブ', icon: '👗' },
  { key: 'builder', label: 'コーデを作る', icon: '✨' },
  { key: 'outfits', label: 'マイコーデ', icon: '📋' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('wardrobe');
  const [items, setItems] = useState<ClothingItem[]>(() => loadClothingItems());
  const [outfits, setOutfits] = useState<Outfit[]>(() => loadOutfits());
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddItem = (item: ClothingItem) => {
    const updated = [item, ...items];
    setItems(updated);
    saveClothingItems(updated);
    setShowAddModal(false);
  };

  const handleDeleteItem = (id: string) => {
    if (!confirm('この服を削除しますか？')) return;
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    saveClothingItems(updated);
  };

  const handleSaveOutfit = (outfit: Outfit) => {
    const updated = [outfit, ...outfits];
    setOutfits(updated);
    saveOutfits(updated);
  };

  const handleDeleteOutfit = (id: string) => {
    if (!confirm('このコーデを削除しますか？')) return;
    const updated = outfits.filter((o) => o.id !== id);
    setOutfits(updated);
    saveOutfits(updated);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2">
              <span className="text-2xl">👔</span>
              <h1 className="text-lg font-bold text-gray-800">Clothes Manager</h1>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm"
            >
              <span className="text-base">＋</span>
              <span>追加</span>
            </button>
          </div>

          {/* Tab navigation */}
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`tab-btn flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                  activeTab === tab.key
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.key === 'wardrobe' && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.key ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {items.length}
                  </span>
                )}
                {tab.key === 'outfits' && outfits.length > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.key ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {outfits.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        {activeTab === 'wardrobe' && (
          <WardrobeTab
            items={items}
            onDelete={handleDeleteItem}
            onAddClick={() => setShowAddModal(true)}
          />
        )}
        {activeTab === 'builder' && (
          <OutfitBuilderTab
            items={items}
            onSaveOutfit={handleSaveOutfit}
            onAddClothingClick={() => { setActiveTab('wardrobe'); setShowAddModal(true); }}
          />
        )}
        {activeTab === 'outfits' && (
          <MyOutfitsTab
            outfits={outfits}
            items={items}
            onDelete={handleDeleteOutfit}
            onBuildClick={() => setActiveTab('builder')}
          />
        )}
      </main>

      {/* Add clothing modal */}
      {showAddModal && (
        <AddClothingModal
          onAdd={handleAddItem}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}
