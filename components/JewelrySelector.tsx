'use client';

import { useState } from 'react';
import { JewelryItem } from '@/lib/types';
import { jewelryCollection } from '@/lib/jewelry-data';

interface JewelrySelectorProps {
  onSelectionComplete: (selectedItems: JewelryItem[]) => void;
  onBack: () => void;
}

export default function JewelrySelector({ onSelectionComplete, onBack }: JewelrySelectorProps) {
  const [selectedItems, setSelectedItems] = useState<JewelryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<'all' | 'earrings' | 'necklace' | 'bracelet' | 'ring'>('all');

  const categories = [
    { id: 'all', name: 'All Jewelry', emoji: '💎' },
    { id: 'earrings', name: 'Earrings', emoji: '👂' },
    { id: 'necklace', name: 'Necklaces', emoji: '🔗' },
    { id: 'bracelet', name: 'Bracelets', emoji: '💍' },
    { id: 'ring', name: 'Rings', emoji: '💍' }
  ];

  const filteredJewelry = activeCategory === 'all'
    ? jewelryCollection
    : jewelryCollection.filter(item => item.category === activeCategory);

  const toggleSelection = (item: JewelryItem) => {
    setSelectedItems(prev => {
      const isSelected = prev.find(selected => selected.id === item.id);
      if (isSelected) {
        return prev.filter(selected => selected.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const isSelected = (item: JewelryItem) => {
    return selectedItems.some(selected => selected.id === item.id);
  };

  const handleContinue = () => {
    if (selectedItems.length === 0) {
      alert('Please select at least one jewelry item');
      return;
    }
    onSelectionComplete(selectedItems);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Choose Your Jewelry</h2>
        <p className="text-gray-600">Select jewelry items to virtually try on</p>
        <div className="mt-4 text-sm text-blue-600">
          {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id as 'earrings' | 'necklace' | 'bracelet' | 'ring' | 'all')}
            className={`px-4 py-2 rounded-full transition-colors ${
              activeCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.emoji} {category.name}
          </button>
        ))}
      </div>

      {/* Jewelry Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredJewelry.map(item => (
          <div
            key={item.id}
            className={`relative cursor-pointer transition-all duration-300 ${
              isSelected(item)
                ? 'ring-4 ring-blue-500 rounded-lg shadow-lg transform scale-105'
                : 'hover:shadow-lg hover:transform hover:scale-105'
            }`}
            onClick={() => toggleSelection(item)}
          >
            {/* Selection Indicator */}
            {isSelected(item) && (
              <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center z-10">
                ✓
              </div>
            )}

            {/* Jewelry Card */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="aspect-square overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1">{item.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                {item.price && (
                  <p className="text-lg font-bold text-blue-600">${item.price}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Items Preview */}
      {selectedItems.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold mb-3">Selected Items ({selectedItems.length})</h3>
          <div className="flex flex-wrap gap-2">
            {selectedItems.map(item => (
              <div
                key={item.id}
                className="flex items-center bg-white rounded-full px-3 py-1 text-sm"
              >
                <span>{item.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSelection(item);
                  }}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
        >
          ← Back to Photo
        </button>

        <button
          onClick={handleContinue}
          disabled={selectedItems.length === 0}
          className={`px-8 py-3 rounded-lg font-medium transition-colors ${
            selectedItems.length > 0
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Try On Selected Items →
        </button>
      </div>
    </div>
  );
}