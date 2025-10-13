'use client';
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useKioskJourney } from '@/components/KioskJourneyProvider';
import { jewelryCollection } from '@/lib/jewelry-data';
import type { JewelryItem } from '@/lib/types';

const CATEGORY_ORDER = ['earrings', 'necklace', 'bracelet', 'ring'] as const;
type Category = typeof CATEGORY_ORDER[number];
type Occasion = NonNullable<JewelryItem['occasion']>;
type Style = NonNullable<JewelryItem['style']>;

type OccasionFilter = 'all' | Occasion;
type StyleFilter = 'all' | Style;

const categoryLabels: Record<Category, string> = {
  earrings: 'Earrings',
  necklace: 'Necklaces',
  bracelet: 'Bracelets',
  ring: 'Rings',
};

const categoryIcons: Record<Category, string> = {
  earrings: '💎',
  necklace: '📿',
  bracelet: '🔗',
  ring: '💍',
};

export default function JewelrySelectionPage() {
  const router = useRouter();
  const { selectedJewelry, toggleJewelry, budget, hydrateComplete } = useKioskJourney();

  const availableCategories = useMemo(() => {
    const set = new Set<Category>();
    jewelryCollection.forEach(item => set.add(item.category as Category));
    return set;
  }, []);

  const defaultCategory = useMemo<Category>(() => {
    for (const cat of CATEGORY_ORDER) {
      if (availableCategories.has(cat)) {
        return cat;
      }
    }
    return 'earrings';
  }, [availableCategories]);

  const [category, setCategory] = useState<Category>(defaultCategory);
  useEffect(() => {
    setCategory(defaultCategory);
  }, [defaultCategory]);

  const occasionOptions = useMemo<OccasionFilter[]>(() => {
    const values = new Set<Occasion>();
    jewelryCollection.forEach(item => {
      if (item.occasion) {
        values.add(item.occasion);
      }
    });
    return ['all', ...Array.from(values)];
  }, []);

  const styleOptions = useMemo<StyleFilter[]>(() => {
    const values = new Set<Style>();
    jewelryCollection.forEach(item => {
      if (item.style) {
        values.add(item.style);
      }
    });
    return ['all', ...Array.from(values)];
  }, []);

  const [occasionFilter, setOccasionFilter] = useState<OccasionFilter>('all');
  const [styleFilter, setStyleFilter] = useState<StyleFilter>('all');

  const filteredJewelry = useMemo(() => {
    return jewelryCollection
      .filter(item => item.category === category)
      .filter(item => (typeof item.price === 'number' ? item.price <= budget : true))
      .filter(item => (occasionFilter === 'all' ? true : item.occasion === occasionFilter))
      .filter(item => (styleFilter === 'all' ? true : item.style === styleFilter))
      .sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
  }, [category, budget, occasionFilter, styleFilter]);

  const isSelected = (item: JewelryItem) => selectedJewelry.some(selected => selected.id === item.id);

  const handleContinue = () => {
    if (!selectedJewelry.length) {
      return;
    }
    router.push('/kiosk/tryon');
  };

  return (
    <div className="min-h-screen gradient-background flex flex-col">
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
            {selectedJewelry.length > 0 && (
              <span className="w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                {selectedJewelry.length}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 lg:p-12 flex flex-col gap-6">
        <div className="flex items-center gap-2 justify-center">
          <div className="w-3 h-3 rounded-full bg-success"></div>
          <div className="w-3 h-3 rounded-full bg-primary shadow-lg" style={{ boxShadow: '0 0 10px oklch(0.75 0.15 85 / 0.5)' }}></div>
          <div className="w-3 h-3 rounded-full bg-muted"></div>
          <div className="w-3 h-3 rounded-full bg-muted"></div>
          <div className="w-3 h-3 rounded-full bg-muted"></div>
          <div className="w-3 h-3 rounded-full bg-muted"></div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 flex flex-wrap gap-3 justify-center mx-auto">
          {CATEGORY_ORDER.map(cat => {
            const disabled = !availableCategories.has(cat);
            const isActive = category === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  if (!disabled) {
                    setCategory(cat);
                  }
                }}
                className={`px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
                  disabled
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : isActive
                      ? 'bg-primary text-primary-foreground shadow-gold'
                      : 'bg-card/80 border border-border hover:border-primary'
                }`}
              >
                <span>{categoryIcons[cat]}</span>
                {categoryLabels[cat]}
              </button>
            );
          })}
        </div>

        <div className="bg-card border border-border rounded-xl p-4 flex flex-col lg:flex-row items-center justify-between gap-4 max-w-xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-muted-foreground font-medium">Your Budget:</div>
            <div className="text-2xl font-bold text-gold" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              ${budget}
            </div>
          </div>
          <Link href="/kiosk/photo" className="px-4 py-2 border-2 border-border rounded-lg hover:border-primary transition-colors text-sm font-medium">
            Change
          </Link>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 flex flex-wrap gap-4 items-center justify-center max-w-3xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground font-medium">Occasion:</label>
            <select
              value={occasionFilter}
              onChange={(e) => setOccasionFilter(e.target.value as OccasionFilter)}
              className="px-3 py-2 border border-border rounded-lg bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={!hydrateComplete}
            >
              {occasionOptions.map(option => (
                <option key={option} value={option}>
                  {option === 'all' ? 'All Occasions' : option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground font-medium">Style:</label>
            <select
              value={styleFilter}
              onChange={(e) => setStyleFilter(e.target.value as StyleFilter)}
              className="px-3 py-2 border border-border rounded-lg bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={!hydrateComplete}
            >
              {styleOptions.map(option => (
                <option key={option} value={option}>
                  {option === 'all' ? 'All Styles' : option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 max-w-6xl mx-auto w-full">
          {filteredJewelry.map(item => {
            const selected = isSelected(item);
            return (
              <div
                key={item.id}
                onClick={() => toggleJewelry(item)}
                className={`card-luxury cursor-pointer transition-all relative ${
                  selected ? 'border-primary shadow-gold bg-primary/5' : ''
                }`}
              >
                {selected && (
                  <div className="absolute top-2 right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm z-10">
                    ✓
                  </div>
                )}
                <div className="w-full h-32 bg-input rounded-lg overflow-hidden mb-3">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold mb-1">{item.name}</h3>
                  {typeof item.price === 'number' && (
                    <p className="text-xl font-bold text-gold mb-1" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                      ${item.price}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">
                    {`${item.style ?? 'classic'} • ${item.occasion ?? 'formal'}`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {filteredJewelry.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-xl font-semibold mb-2">No jewelry found</h3>
            <p>Try selecting a different style or occasion.</p>
          </div>
        )}

        <button
          onClick={handleContinue}
          disabled={selectedJewelry.length === 0}
          className={`btn-luxury btn-gold text-xl px-12 py-4 mx-auto ${
            selectedJewelry.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0-7 7m7-7H3" />
          </svg>
          Continue to Try-On
        </button>
      </main>
    </div>
  );
}
