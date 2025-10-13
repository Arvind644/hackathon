'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type JewelryItem = {
  id: number;
  name: string;
  price: number;
  material: string;
  emoji: string;
  occasion: string;
  style: string;
};

const jewelryData: Record<string, JewelryItem[]> = {
  earrings: [
    { id: 1, name: "Diamond Studs", price: 299, material: "14K Gold", emoji: "💎", occasion: "formal", style: "classic" },
    { id: 2, name: "Pearl Drops", price: 199, material: "Sterling Silver", emoji: "🦪", occasion: "formal", style: "classic" },
    { id: 3, name: "Ruby Hoops", price: 399, material: "18K Gold", emoji: "🔴", occasion: "party", style: "modern" },
    { id: 4, name: "Emerald Chandeliers", price: 599, material: "Platinum", emoji: "💚", occasion: "formal", style: "vintage" },
    { id: 5, name: "Sapphire Clusters", price: 449, material: "White Gold", emoji: "💙", occasion: "casual", style: "modern" },
    { id: 6, name: "Gold Hoops", price: 149, material: "14K Gold", emoji: "🟡", occasion: "casual", style: "classic" }
  ],
  necklaces: [
    { id: 7, name: "Pearl Strand", price: 799, material: "Sterling Silver", emoji: "🦪", occasion: "formal", style: "classic" },
    { id: 8, name: "Diamond Pendant", price: 1299, material: "Platinum", emoji: "💎", occasion: "formal", style: "classic" },
    { id: 9, name: "Emerald Choker", price: 899, material: "18K Gold", emoji: "💚", occasion: "party", style: "modern" },
    { id: 10, name: "Ruby Statement", price: 1099, material: "Rose Gold", emoji: "🔴", occasion: "formal", style: "vintage" }
  ],
  bracelets: [
    { id: 11, name: "Diamond Tennis", price: 1999, material: "Platinum", emoji: "💎", occasion: "formal", style: "classic" },
    { id: 12, name: "Pearl Strand", price: 399, material: "Sterling Silver", emoji: "🦪", occasion: "formal", style: "classic" },
    { id: 13, name: "Ruby Bangle", price: 599, material: "18K Gold", emoji: "🔴", occasion: "party", style: "modern" }
  ],
  rings: [
    { id: 14, name: "Diamond Solitaire", price: 2999, material: "Platinum", emoji: "💎", occasion: "wedding", style: "classic" },
    { id: 15, name: "Pearl Cocktail", price: 699, material: "Sterling Silver", emoji: "🦪", occasion: "formal", style: "vintage" },
    { id: 16, name: "Ruby Statement", price: 899, material: "18K Gold", emoji: "🔴", occasion: "party", style: "modern" }
  ]
};

export default function JewelrySelectionPage() {
  const router = useRouter();
  const [category, setCategory] = useState('earrings');
  const [selected, setSelected] = useState<number[]>([]);
  const [budget] = useState(1000);
  const [occasionFilter, setOccasionFilter] = useState('all');
  const [styleFilter, setStyleFilter] = useState('all');

  const filteredJewelry = jewelryData[category].filter(item => {
    const priceMatch = item.price <= budget;
    const occasionMatch = occasionFilter === 'all' || item.occasion === occasionFilter;
    const styleMatch = styleFilter === 'all' || item.style === styleFilter;
    return priceMatch && occasionMatch && styleMatch;
  });

  const toggleSelection = (id: number) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    if (selected.length > 0) {
      router.push('/kiosk/tryon');
    }
  };

  return (
    <div className="min-h-screen gradient-background flex flex-col">
      {/* Header */}
      <header className="p-4 lg:p-6 bg-card border-b border-border flex items-center justify-between">
        <Link href="/kiosk/photo" className="flex items-center gap-2 px-4 py-2 border-2 border-border rounded-lg hover:border-primary transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
        <h1 className="text-xl lg:text-2xl font-semibold text-gold" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
          EVOL JEWELS
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Step 2 of 6</span>
          <button className="btn-luxury btn-gold px-4 py-2 text-sm">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Cart
            {selected.length > 0 && (
              <span className="w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                {selected.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-12 flex flex-col gap-6">
        {/* Step Indicator */}
        <div className="flex items-center gap-2 justify-center">
          <div className="w-3 h-3 rounded-full bg-success"></div>
          <div className="w-3 h-3 rounded-full bg-primary shadow-lg" style={{ boxShadow: '0 0 10px oklch(0.75 0.15 85 / 0.5)' }}></div>
          <div className="w-3 h-3 rounded-full bg-muted"></div>
          <div className="w-3 h-3 rounded-full bg-muted"></div>
          <div className="w-3 h-3 rounded-full bg-muted"></div>
          <div className="w-3 h-3 rounded-full bg-muted"></div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-3 justify-center">
          {['earrings', 'necklaces', 'bracelets', 'rings'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-6 py-3 border-2 rounded-xl font-semibold capitalize transition-all ${
                category === cat
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border hover:border-primary'
              }`}
            >
              {cat === 'earrings' && '✨ '}
              {cat === 'necklaces' && '💎 '}
              {cat === 'bracelets' && '⭕ '}
              {cat === 'rings' && '💍 '}
              {cat}
            </button>
          ))}
        </div>

        {/* Budget Display */}
        <div className="bg-card border-2 border-primary rounded-2xl p-4 lg:p-6 shadow-lg max-w-2xl mx-auto w-full" style={{ boxShadow: '0 0 20px oklch(0.75 0.15 85 / 0.3)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-muted-foreground font-medium">Your Budget:</span>
              <span className="text-2xl font-bold text-gold" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                ${budget}
              </span>
            </div>
            <Link href="/kiosk/photo" className="px-4 py-2 border-2 border-border rounded-lg hover:border-primary transition-colors text-sm font-medium">
              Change
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-xl p-4 flex flex-wrap gap-4 items-center justify-center max-w-3xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground font-medium">Occasion:</label>
            <select
              value={occasionFilter}
              onChange={(e) => setOccasionFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Occasions</option>
              <option value="casual">Casual</option>
              <option value="formal">Formal</option>
              <option value="wedding">Wedding</option>
              <option value="party">Party</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground font-medium">Style:</label>
            <select
              value={styleFilter}
              onChange={(e) => setStyleFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Styles</option>
              <option value="classic">Classic</option>
              <option value="modern">Modern</option>
              <option value="vintage">Vintage</option>
            </select>
          </div>
        </div>

        {/* Jewelry Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 max-w-6xl mx-auto w-full">
          {filteredJewelry.map(item => (
            <div
              key={item.id}
              onClick={() => toggleSelection(item.id)}
              className={`card-luxury cursor-pointer transition-all ${
                selected.includes(item.id)
                  ? 'border-primary shadow-gold bg-primary/5'
                  : ''
              }`}
            >
              {selected.includes(item.id) && (
                <div className="absolute top-2 right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm z-10">
                  ✓
                </div>
              )}
              <div className="w-full h-32 bg-input rounded-lg flex items-center justify-center text-5xl mb-3">
                {item.emoji}
              </div>
              <div className="text-center">
                <h3 className="font-semibold mb-1">{item.name}</h3>
                <p className="text-xl font-bold text-gold mb-1" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                  ${item.price}
                </p>
                <p className="text-sm text-muted-foreground">{item.material}</p>
              </div>
            </div>
          ))}
        </div>

        {filteredJewelry.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-xl font-semibold mb-2">No jewelry found</h3>
            <p>Try adjusting your filters or budget</p>
          </div>
        )}

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={selected.length === 0}
          className={`btn-luxury btn-gold text-xl px-12 py-4 mx-auto ${
            selected.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
          Continue to Try-On
        </button>
      </main>
    </div>
  );
}
