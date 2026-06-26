import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { ClothingItem, Outfit } from '../types';
import ClothingCard from './ClothingCard';

interface Props {
  items: ClothingItem[];
  onSaveOutfit: (outfit: Outfit) => void;
  onAddClothingClick: () => void;
}

type Step = 'top' | 'bottom' | 'accessory' | 'confirm';

export default function OutfitBuilderTab({ items, onSaveOutfit, onAddClothingClick }: Props) {
  const [step, setStep] = useState<Step>('top');
  const [selectedTop, setSelectedTop] = useState<ClothingItem | null>(null);
  const [selectedBottom, setSelectedBottom] = useState<ClothingItem | null>(null);
  const [selectedAccessories, setSelectedAccessories] = useState<ClothingItem[]>([]);
  const [outfitName, setOutfitName] = useState('');
  const [outfitNote, setOutfitNote] = useState('');
  const [saved, setSaved] = useState(false);

  const tops = items.filter((i) => i.category === 'top');
  const bottoms = items.filter((i) => i.category === 'bottom');
  const accessories = items.filter((i) => i.category === 'accessory');

  const toggleAccessory = (item: ClothingItem) => {
    setSelectedAccessories((prev) =>
      prev.find((a) => a.id === item.id)
        ? prev.filter((a) => a.id !== item.id)
        : [...prev, item]
    );
  };

  const steps: { key: Step; label: string; icon: string }[] = [
    { key: 'top', label: 'トップス', icon: '👕' },
    { key: 'bottom', label: 'ボトムス', icon: '👖' },
    { key: 'accessory', label: '小物', icon: '🎩' },
    { key: 'confirm', label: '確認・保存', icon: '✨' },
  ];

  const stepIndex = steps.findIndex((s) => s.key === step);

  const handleSave = () => {
    const outfit: Outfit = {
      id: uuidv4(),
      name: outfitName.trim() || `コーデ ${new Date().toLocaleDateString('ja-JP')}`,
      topId: selectedTop?.id,
      bottomId: selectedBottom?.id,
      accessoryIds: selectedAccessories.map((a) => a.id),
      note: outfitNote.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    onSaveOutfit(outfit);
    setSaved(true);
  };

  const handleReset = () => {
    setStep('top');
    setSelectedTop(null);
    setSelectedBottom(null);
    setSelectedAccessories([]);
    setOutfitName('');
    setOutfitNote('');
    setSaved(false);
  };

  if (saved) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">コーデを保存しました！</h3>
        <p className="text-gray-500 text-sm mb-6">「マイコーデ」タブで確認できます</p>
        <button
          onClick={handleReset}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
        >
          新しいコーデを作る
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center justify-between mb-6 px-2">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center">
            <button
              onClick={() => i < stepIndex && setStep(s.key)}
              className={`flex flex-col items-center gap-1 ${i < stepIndex ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all ${
                step === s.key
                  ? 'bg-indigo-600 border-indigo-600 shadow-md'
                  : i < stepIndex
                  ? 'bg-indigo-100 border-indigo-300'
                  : 'bg-gray-100 border-gray-200'
              }`}>
                {s.icon}
              </div>
              <span className={`text-xs font-medium ${step === s.key ? 'text-indigo-600' : 'text-gray-400'}`}>
                {s.label}
              </span>
            </button>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mb-4 ${i < stepIndex ? 'bg-indigo-300' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Current outfit preview (mini) */}
      {(selectedTop || selectedBottom || selectedAccessories.length > 0) && step !== 'confirm' && (
        <div className="bg-gray-50 rounded-xl p-3 mb-5 flex items-center gap-3 overflow-x-auto">
          <span className="text-xs text-gray-500 flex-shrink-0">選択中:</span>
          {selectedTop && (
            <div className="flex-shrink-0 flex flex-col items-center gap-1">
              <img src={selectedTop.imageData} className="w-12 h-12 object-contain rounded-lg bg-white p-1" alt={selectedTop.name} />
              <span className="text-xs text-gray-500 w-14 text-center truncate">{selectedTop.name}</span>
            </div>
          )}
          {selectedBottom && (
            <div className="flex-shrink-0 flex flex-col items-center gap-1">
              <img src={selectedBottom.imageData} className="w-12 h-12 object-contain rounded-lg bg-white p-1" alt={selectedBottom.name} />
              <span className="text-xs text-gray-500 w-14 text-center truncate">{selectedBottom.name}</span>
            </div>
          )}
          {selectedAccessories.map((a) => (
            <div key={a.id} className="flex-shrink-0 flex flex-col items-center gap-1">
              <img src={a.imageData} className="w-12 h-12 object-contain rounded-lg bg-white p-1" alt={a.name} />
              <span className="text-xs text-gray-500 w-14 text-center truncate">{a.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Step content */}
      {step === 'top' && (
        <SelectStep
          title="トップスを選ぶ"
          items={tops}
          selected={selectedTop ? [selectedTop] : []}
          onSelect={(item) => setSelectedTop(selectedTop?.id === item.id ? null : item)}
          emptyMsg="トップスが登録されていません"
          onAddClick={onAddClothingClick}
          onNext={() => setStep('bottom')}
          nextLabel="ボトムスを選ぶ →"
          canSkip
          onSkip={() => setStep('bottom')}
        />
      )}

      {step === 'bottom' && (
        <SelectStep
          title="ボトムスを選ぶ"
          items={bottoms}
          selected={selectedBottom ? [selectedBottom] : []}
          onSelect={(item) => setSelectedBottom(selectedBottom?.id === item.id ? null : item)}
          emptyMsg="ボトムスが登録されていません"
          onAddClick={onAddClothingClick}
          onNext={() => setStep('accessory')}
          nextLabel="小物を選ぶ →"
          canSkip
          onSkip={() => setStep('accessory')}
          onBack={() => setStep('top')}
        />
      )}

      {step === 'accessory' && (
        <SelectStep
          title="小物・アクセサリーを選ぶ"
          items={accessories}
          selected={selectedAccessories}
          onSelect={toggleAccessory}
          multi
          emptyMsg="小物が登録されていません"
          onAddClick={onAddClothingClick}
          onNext={() => setStep('confirm')}
          nextLabel="確認する →"
          canSkip
          onSkip={() => setStep('confirm')}
          onBack={() => setStep('bottom')}
        />
      )}

      {step === 'confirm' && (
        <div className="space-y-5">
          <h3 className="text-base font-semibold text-gray-700">コーデの確認・保存</h3>

          {/* Outfit preview */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5">
            <div className="flex flex-wrap gap-4 justify-center">
              {selectedTop && (
                <OutfitPreviewItem item={selectedTop} label="トップス" />
              )}
              {selectedBottom && (
                <OutfitPreviewItem item={selectedBottom} label="ボトムス" />
              )}
              {selectedAccessories.map((a) => (
                <OutfitPreviewItem key={a.id} item={a} label="小物" />
              ))}
              {!selectedTop && !selectedBottom && selectedAccessories.length === 0 && (
                <p className="text-gray-400 text-sm py-4">アイテムが選択されていません</p>
              )}
            </div>
          </div>

          {/* Name and note */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">コーデ名</label>
              <input
                type="text"
                value={outfitName}
                onChange={(e) => setOutfitName(e.target.value)}
                placeholder={`コーデ ${new Date().toLocaleDateString('ja-JP')}`}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">メモ（任意）</label>
              <textarea
                value={outfitNote}
                onChange={(e) => setOutfitNote(e.target.value)}
                placeholder="どんなシーンに合う？など"
                rows={2}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep('accessory')}
              className="flex-1 py-3 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl font-medium transition-colors"
            >
              ← 戻る
            </button>
            <button
              onClick={handleSave}
              disabled={!selectedTop && !selectedBottom && selectedAccessories.length === 0}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
            >
              保存する ✨
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function OutfitPreviewItem({ item, label }: { item: ClothingItem; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-24 h-24 bg-white rounded-xl shadow-sm flex items-center justify-center p-2">
        <img src={item.imageData} alt={item.name} className="w-full h-full object-contain" />
      </div>
      <div className="text-center">
        <p className="text-xs text-indigo-600 font-medium">{label}</p>
        <p className="text-xs text-gray-700 truncate w-24">{item.name}</p>
      </div>
    </div>
  );
}

interface SelectStepProps {
  title: string;
  items: ClothingItem[];
  selected: ClothingItem[];
  onSelect: (item: ClothingItem) => void;
  multi?: boolean;
  emptyMsg: string;
  onAddClick: () => void;
  onNext: () => void;
  nextLabel: string;
  canSkip?: boolean;
  onSkip?: () => void;
  onBack?: () => void;
}

function SelectStep({
  title, items, selected, onSelect, multi, emptyMsg,
  onAddClick, onNext, nextLabel, canSkip, onSkip, onBack
}: SelectStepProps) {
  const isSelected = (item: ClothingItem) => selected.some((s) => s.id === item.id);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-700">{title}</h3>
        {multi && selected.length > 0 && (
          <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
            {selected.length}個選択中
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-center">
          <p className="text-gray-400 text-sm">{emptyMsg}</p>
          <button
            onClick={onAddClick}
            className="mt-3 text-indigo-600 text-sm hover:underline"
          >
            ＋ 服を追加する
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-5">
          {items.map((item) => (
            <ClothingCard
              key={item.id}
              item={item}
              selectable
              selected={isSelected(item)}
              onSelect={onSelect}
              compact
            />
          ))}
        </div>
      )}

      <div className="flex gap-3 mt-4">
        {onBack && (
          <button
            onClick={onBack}
            className="px-4 py-3 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl font-medium transition-colors"
          >
            ← 戻る
          </button>
        )}
        {canSkip && onSkip && selected.length === 0 && (
          <button
            onClick={onSkip}
            className="flex-1 py-3 border border-gray-200 hover:bg-gray-50 text-gray-500 rounded-xl font-medium transition-colors text-sm"
          >
            スキップ
          </button>
        )}
        <button
          onClick={onNext}
          className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
        >
          {nextLabel}
        </button>
      </div>
    </div>
  );
}
